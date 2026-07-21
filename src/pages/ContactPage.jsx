import { useState } from 'react'
import './ContactPage.css'

const CONTACT_EMAIL = 'cunyan_ma@brown.edu'

function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', institution: '' })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    // Static site with no backend: compose a pre-filled email to CONTACT_EMAIL
    // so the signup actually reaches a real inbox. Swap this for a form service
    // (Formspree, Google Form, etc.) if a hands-off subscriber list is wanted.
    const handleSubmit = (e) => {
        e.preventDefault()
        const subject = 'Sign me up for future updates'
        const body =
            `Name: ${form.name}\n` +
            `Email: ${form.email}\n` +
            `Institution: ${form.institution}\n`
        window.location.href =
            `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`
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
                    <span>Name</span>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="contact-field">
                    <span>Email</span>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="contact-field">
                    <span>Institution</span>
                    <input
                        type="text"
                        name="institution"
                        value={form.institution}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit" className="contact-submit">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default ContactPage
