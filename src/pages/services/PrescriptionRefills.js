import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../services/VirtualConsultation.css';
import Breadcrumb from "../../components/Breadcrumb";
import prescription_img from '../../assets/img/services/prescription.png';
import step_bg from '../../assets/img/bg/steps-bg.png';
import heart_img from '../../assets/img/icons/hreat-pulse.svg';
import { Container, Col, Row } from "react-bootstrap";


export default function PrescriptionRefills() {
    return (
        <>
            <Header />
            <Breadcrumb />
            <div className="Patients-section-fifteen">
               <Container>
                   <Row>
                       <Col lg='6'>
                            <div className="patients-left-front patients-left-img">
                                <img src={prescription_img} alt="Patients" className="img-fluid" />
                            </div>
                        </Col>
                        <Col lg='6'>
                            <div className="section-header-fifteen section-header-fifteenpatient">
                                <h2>Prescription  <span>Refills</span></h2>
                                <p className="text-justify">
                                    At CHS Caresmart Health Solution, we know that managing your medications is essential for your health. That’s why we offer a straightforward process for prescription refills to ensure you have continuous access to the medications you need.
                                </p>
                            </div>
                            <p>Check our calendar for real-time availability of our healthcare providers. This means you can see which appointments are open and choose the one that fits your schedule without any back-and-forth communication.
                            </p>
                        
                       </Col>
                    </Row>
                </Container>
           </div>

            <div className="main-wrapper home-ten">
                <section className="need-to-know-section steps-to-follow">
                    <div className="bg-shapes">
                        <img src={step_bg} alt="image" />
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-7 mx-auto">
                            <div className="section-header-fifteen text-center">
							<h2>How to Request a <span>Prescription Refill</span></h2>
                            <p>Connect with your chosen healthcare professional at the scheduled time. After your appointment, follow any post-visit instructions provided by the doctor. </p>
                          
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-6 aos aos-init aos-animate" data-aos="fade-up">
                                <div className="box-detail">
                                    <div className="steps-list-box">
                                        <div className="steps-list-img">
                                            <span>1</span>
                                            <img src={heart_img} className="img-fluid" alt="heart-pulse" />
                                        </div>
                                        <h6>Online Request</h6>
                                        <p>Use our patient portal to submit a refill request. Simply log in, select the medication you need to refill, and follow the prompts.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 aos aos-init aos-animate" data-aos="fade-up">
                                <div className="box-detail">
                                    <div className="steps-list-box">
                                        <div className="steps-list-img">
                                            <span>2</span>
                                            <img src={heart_img} className="img-fluid" alt="heart-pulse" />
                                        </div>
                                        <h6>Phone Request</h6>
                                        <p>Call our office at +91 1800****** during office hours. Our staff will assist you in processing your refill request.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 aos aos-init aos-animate" data-aos="fade-up">
                                <div className="box-detail">
                                    <div className="steps-list-box">
                                        <div className="steps-list-img">
                                            <span>3</span>
                                            <img src={heart_img} className="img-fluid" alt="heart-pulse" />
                                        </div>
                                        <h6>Pharmacy Request</h6>
                                        <p>You can also ask your pharmacy to contact us directly for a refill. Make sure they have your current prescription details.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
		




             <section className="frequently-section-fifteen">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="section-header-fifteen text-center">
							<h2>FAQs About <span>Prescription Refills</span></h2>
							<p>What our clients say about us</p>
						</div>
					</div>
				</div>
				<div className="faq-main-cards" id="accordionExample">
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
						<div className="faq-title">
							<a data-bs-toggle="collapse" href="#faqOne" aria-expanded="false"> 
								<span>Can I get a refill on a medication that I haven't seen the doctor for in a while?</span>
							</a>
							<div id="faqOne" className="card-collapse collapse show" data-bs-parent="#accordionExample">
								<p>Depending on the medication and your treatment plan, a follow-up appointment may be necessary. Our team can provide guidance.</p>
							</div>	
						</div>
					</div>
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">																																
						<div className="faq-title">
							<a className="collapsed" data-bs-toggle="collapse" href="#faqtwo" aria-expanded="false">
								<span>What if I need a refill urgently?</span>
							</a>
							<div id="faqtwo" className="card-collapse collapse" data-bs-parent="#accordionExample">
								<p>If you have an urgent need, please contact our office directly, and we’ll do our best to accommodate your request.</p>
							</div>
						</div>
					</div>
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
						<div className="faq-title">
							<a className="collapsed" data-bs-toggle="collapse" href="#faqthree" aria-expanded="false">
								<span>Can I change my pharmacy for a refill?</span>							
							</a>
							<div id="faqthree" className="card-collapse collapse" data-bs-parent="#accordionExample">
								<p>Yes, simply inform us of the new pharmacy's name and phone number when you request your refill.</p>
							</div>
						</div>
					</div>	
				</div>	
			</div>
		</section>
            <Footer />
        </>
    );
}