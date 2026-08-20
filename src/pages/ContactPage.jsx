import { useState } from 'react'
import './ContactPage.css'

const CONTACT_EMAIL = 'ai-materiality-map@proton.me'

// Mailchimp's embedded-form endpoint: a public, per-audience URL with no API
// key in it, which is what makes it safe to call from a static frontend.
// `post-json` is the JSONP variant of the `post` URL in the embed snippet.
const MAILCHIMP_URL =
    'https://proton.us3.list-manage.com/subscribe/post-json' +
    '?u=4ea8b6c1468abdf9a83a26c82&id=042c78fb4d&f_id=009b0ce1f0'

// Mailchimp's bot trap: a real person never sees or fills this, so a non-empty
// value marks the submission as spam. Audience-specific — keep it verbatim.
const HONEYPOT_NAME = 'b_4ea8b6c1468abdf9a83a26c82_042c78fb4d'

// The endpoint sends no CORS headers, so fetch() is blocked outright. JSONP
// (script tag + callback param) is the standard way around that.
function subscribeViaJsonp(params) {
    return new Promise((resolve, reject) => {
        const callbackName = `mcCallback_${Date.now()}`
        const script = document.createElement('script')

        const cleanup = () => {
            delete window[callbackName]
            script.remove()
        }

        window[callbackName] = (data) => {
            cleanup()
            resolve(data)
        }

        script.onerror = () => {
            cleanup()
            reject(new Error('Could not reach Mailchimp'))
        }

        script.src = `${MAILCHIMP_URL}&c=${callbackName}&${params}`
        document.body.appendChild(script)
    })
}

// Mailchimp prefixes some errors with a field index ("0 - ...") and can return
// small fragments of HTML in the message; flatten both for plain-text display.
function cleanMessage(msg) {
    return String(msg || '')
        .replace(/^\d+\s*-\s*/, '')
        .replace(/<[^>]*>/g, '')
        .trim()
}

function ContactPage() {
    const [form, setForm] = useState({
        EMAIL: '',
        FNAME: '',
        LNAME: '',
        COMPANY: ''
    })
    const [honeypot, setHoneypot] = useState('')
    const [status, setStatus] = useState('idle')
    const [message, setMessage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('submitting')
        setMessage('')

        const params = new URLSearchParams({
            ...form,
            [HONEYPOT_NAME]: honeypot
        }).toString()

        try {
            const data = await subscribeViaJsonp(params)
            const clean = cleanMessage(data.msg)
            if (data.result === 'success') {
                setStatus('success')
                setMessage(clean || 'Thanks — check your inbox to confirm.')
            } else {
                setStatus('error')
                setMessage(clean || 'Something went wrong. Please try again.')
            }
        } catch {
            setStatus('error')
            setMessage(
                `Could not reach the signup service. Email ${CONTACT_EMAIL} instead.`
            )
        }
    }

    return (
        <div className="contact-container">
            <h1>Contact us</h1>

            <h2>Get in touch</h2>
            <p>
                For any communication, directly email{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>Stay updated</h2>
            <p>
                If you want to be alerted for future updates, input your
                information here:
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
                <label className="contact-field">
                    <span>Email *</span>
                    <input
                        type="email"
                        name="EMAIL"
                        value={form.EMAIL}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="contact-field">
                    <span>First name</span>
                    <input
                        type="text"
                        name="FNAME"
                        value={form.FNAME}
                        onChange={handleChange}
                    />
                </label>

                <label className="contact-field">
                    <span>Last name</span>
                    <input
                        type="text"
                        name="LNAME"
                        value={form.LNAME}
                        onChange={handleChange}
                    />
                </label>

                <label className="contact-field">
                    <span>Institution</span>
                    <input
                        type="text"
                        name="COMPANY"
                        value={form.COMPANY}
                        onChange={handleChange}
                    />
                </label>

                {/* Positioned offscreen rather than hidden, the way Mailchimp
                    ships it: bots fill it, people never see it. */}
                <div aria-hidden="true" className="contact-honeypot">
                    <input
                        type="text"
                        name={HONEYPOT_NAME}
                        tabIndex={-1}
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="contact-submit"
                    disabled={status === 'submitting'}
                >
                    {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
                </button>

                {message && (
                    <p
                        className={`contact-status contact-status-${status}`}
                        role="status"
                    >
                        {message}
                    </p>
                )}
            </form>
        </div>
    )
}

export default ContactPage
