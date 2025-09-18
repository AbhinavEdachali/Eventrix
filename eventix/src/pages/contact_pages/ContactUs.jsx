import React, { useRef } from 'react'
import ContactUsSection1 from '../../components/ContactUs_components/ConatctUsSection1'
import ContactUsSection2 from '../../components/ContactUs_components/ContactUsSection2'
import ContactUsSection3 from '../../components/ContactUs_components/ConatctUsSection3'
import ContactUsSection4 from '../../components/ContactUs_components/ContactUsSection4'
import ContactUsSection5 from '../../components/ContactUs_components/ContactUsSection5'


const ContactUs = () => {
  const section5Ref = useRef(null);

  const scrollToSection5 = () => {
    section5Ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      
      <ContactUsSection1 scrollToSection5={scrollToSection5} />
      <ContactUsSection2 />
      <ContactUsSection3 />
      <ContactUsSection4 />
      <div ref={section5Ref}>
        <ContactUsSection5 />
       
      </div>
    </div>
  )
}

export default ContactUs
