import './verify.css'
import { IoMdMailUnread } from "react-icons/io";

const Verify = () => {
  return (
    <section className='verifyPageSection'>
      <div className="verifyPageTextWrapper">
        <IoMdMailUnread />
          <h1>verify your email</h1>
        <p>an email with your verification link has been sent to your provided email, click on it to verify your account</p>
        <button
          onClick={() => (window.location.href = "mailto:")}
          className="openMailBtn"
        >
          Open Mail App
        </button>
      </div>
    </section>
  )
}

export default Verify