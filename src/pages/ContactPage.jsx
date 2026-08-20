import './ContactPage.css'

const CONTACT_EMAIL = 'cunyan_ma@brown.edu'

// Signups go through a Google Form for now: the site is static with no backend,
// and this keeps the subscriber list hands-off. `embedded=true` is the variant
// Google serves for iframes (it drops the surrounding Forms chrome).
const SIGNUP_FORM_ID =
    '1FAIpQLSflT4geUpBAJuychGv-BGnhcGSr2_jGqRN43R9GA8zzOV09lA'
const SIGNUP_FORM_URL = `https://docs.google.com/forms/d/e/${SIGNUP_FORM_ID}/viewform`

function ContactPage() {
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
                information here. If the form does not load, open it{' '}
                <a
                    href={SIGNUP_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    in a new tab
                </a>
                .
            </p>

            <div className="contact-embed">
                <iframe
                    src={`${SIGNUP_FORM_URL}?embedded=true`}
                    title="Sign up for future updates"
                    width="100%"
                    height="500"
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                >
                    Loading…
                </iframe>
            </div>
        </div>
    )
}

export default ContactPage
