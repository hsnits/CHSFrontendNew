import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../services/VirtualConsultation.css';
import Breadcrumb from "../../components/Breadcrumb";
import diagnostics_img from '../../assets/img/services/diagonsis.png';
import step_bg from '../../assets/img/bg/steps-bg.png';
import heart_img from '../../assets/img/icons/hreat-pulse.svg';
import { Container, Col, Row } from "react-bootstrap";


export default function Diagnostics() {
    return (
        <>
            <Header />
            <Breadcrumb />
            <div className="Patients-section-fifteen">
               <Container>
                   <Row>
                       <Col lg='6'>
                            <div className="patients-left-front patients-left-img">
                                <img src={diagnostics_img} alt="Patients" className="img-fluid" />
                            </div>
                        </Col>
                        <Col lg='6'>
                            <div className="section-header-fifteen section-header-fifteenpatient">
                                <h2>Diagnostics  <span>Services</span></h2>
                                <p className="text-justify">
                                    At CHS Caresmart Health Solution, we offer a comprehensive range of diagnostic services to help assess your health and support your treatment needs. Our state-of-the-art facilities and experienced healthcare professionals ensure that you receive accurate and timely results.
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
							<h2>How to Schedule a  <span>Diagnostic Test</span></h2>
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
                                        <h6>Online Appointment</h6>
                                        <p>Visit our website to schedule your diagnostic test through our patient portal.</p>
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
                                        <p>For assistance, call our office at +91 1800****** and our staff will help you set up an appointment.</p>
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
                                        <h6>Referral</h6>
                                        <p> If you have a referral from your primary care provider, please bring it along during your visit.</p>
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
							<h2>FAQs About <span>Our Diagnostic Services</span></h2>
							<p>What our clients say about us</p>
						</div>
					</div>
				</div>
				<div className="faq-main-cards" id="accordionExample">
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
						<div className="faq-title">
							<a data-bs-toggle="collapse" href="#faqOne" aria-expanded="false"> 
								<span>Do I need to prepare for certain tests?</span>
							</a>
							<div id="faqOne" className="card-collapse collapse show" data-bs-parent="#accordionExample">
								<p>Yes, some tests may require fasting or specific preparations. Our staff will provide you with all the necessary instructions when you schedule your test.</p>
							</div>	
						</div>
					</div>
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">																																
						<div className="faq-title">
							<a className="collapsed" data-bs-toggle="collapse" href="#faqtwo" aria-expanded="false">
								<span>How will I receive my test results?</span>
							</a>
							<div id="faqtwo" className="card-collapse collapse" data-bs-parent="#accordionExample">
								<p>Results will be available through our patient portal, and we will notify you via email or phone. You can also discuss your results with your healthcare provider during your follow-up appointment.</p>
							</div>
						</div>
					</div>
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
						<div className="faq-title">
							<a className="collapsed" data-bs-toggle="collapse" href="#faqthree" aria-expanded="false">
								<span>Are your diagnostic services covered by insurance?</span>							
							</a>
							<div id="faqthree" className="card-collapse collapse" data-bs-parent="#accordionExample">
								<p>Many of our services are covered by insurance. We recommend checking with your provider for specific coverage details.</p>
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