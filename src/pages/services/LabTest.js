import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../services/VirtualConsultation.css';
import Breadcrumb from "../../components/Breadcrumb";
import labtest_img from '../../assets/img/services/lab_test.png';
import step_bg from '../../assets/img/bg/steps-bg.png';
import heart_img from '../../assets/img/icons/hreat-pulse.svg';
import { Container, Col, Row } from "react-bootstrap";


export default function LabTest() {
    return (
        <>
            <Header />
            <Breadcrumb />
            <div className="Patients-section-fifteen">
               <Container>
                   <Row>
                       <Col lg='6'>
                            <div className="patients-left-front patients-left-img">
                                <img src={labtest_img} alt="Patients" className="img-fluid" />
                            </div>
                        </Col>
                        <Col lg='6'>
                            <div className="section-header-fifteen section-header-fifteenpatient">
                                <h2>Lab  <span>Test Results </span></h2>
                                <p className="text-justify">
                                    At CHS Caresmart Health Solution, we prioritize your health and aim to make accessing your lab test results as straightforward as possible. Here’s how you can view and understand your test results efficiently.
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
							<h2>How to Access Your<span> Lab Test Results </span></h2>
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
                                        <h6>Patient Portal</h6>
                                        <p>Log into our secure patient portal at Patient Login. Here, you can view your lab results as soon as they are available, along with any notes from your healthcare provider.</p>
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
                                        <h6>Email Notification</h6>
                                        <p>Once your results are ready, we will notify you via email. You’ll receive a secure link to access your results directly from the portal.</p>
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
                                        <h6>Call Our Office</h6>
                                        <p>If you prefer to speak with someone, feel free to call us at +91 1800******. Our staff can help you access your results and answer any questions you may have.</p>
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
							<h2>FAQs About <span>Lab Test Results</span></h2>
							<p>What our clients say about us</p>
						</div>
					</div>
				</div>
				<div className="faq-main-cards" id="accordionExample">
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
						<div className="faq-title">
							<a data-bs-toggle="collapse" href="#faqOne" aria-expanded="false"> 
								<span>How long does it take to get my lab results?</span>
							</a>
							<div id="faqOne" className="card-collapse collapse show" data-bs-parent="#accordionExample">
								<p>Generally, lab results are available within [number of days, e.g., 1-3 business days]. Some specialized tests may take longer.</p>
							</div>	
						</div>
					</div>
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">																																
						<div className="faq-title">
							<a className="collapsed" data-bs-toggle="collapse" href="#faqtwo" aria-expanded="false">
								<span>Can I get my results over the phone?</span>
							</a>
							<div id="faqtwo" className="card-collapse collapse" data-bs-parent="#accordionExample">
								<p>While we encourage you to view your results through the patient portal for security reasons, you can call our office for assistance or clarification.</p>
							</div>
						</div>
					</div>
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
						<div className="faq-title">
							<a className="collapsed" data-bs-toggle="collapse" href="#faqthree" aria-expanded="false">
								<span>What if I don’t understand my results?</span>							
							</a>
							<div id="faqthree" className="card-collapse collapse" data-bs-parent="#accordionExample">
								<p>It’s perfectly normal to have questions. Our healthcare team is available to explain any aspects of your results that may be unclear.</p>
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