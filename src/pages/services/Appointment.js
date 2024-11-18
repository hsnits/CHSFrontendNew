import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import '../services/VirtualConsultation.css';
import Breadcrumb from "../../components/Breadcrumb";
import appointment_img from '../../assets/img/services/appointment.png';
import step_bg from '../../assets/img/bg/steps-bg.png';
import heart_img from '../../assets/img/icons/hreat-pulse.svg';
import { Container, Col, Row } from "react-bootstrap";


export default function Appointment() {
    return (
        <>
            <Header />
            <Breadcrumb />
            <div className="Patients-section-fifteen">
               <Container>
                   <Row>
                       <Col lg='6'>
                            <div className="patients-left-front patients-left-img">
                                <img src={appointment_img} alt="Patients" className="img-fluid" />
                            </div>
                        </Col>
                        <Col lg='6'>
                            <div className="section-header-fifteen section-header-fifteenpatient">
                                <h2>Appointment <span>Scheduling</span></h2>
                                <p className="text-justify">
                                    At CHS Caresmart Health Solution, we understand that your time is valuable. That’s why we offer a simple and convenient online appointment scheduling system designed to help you book your visits with ease and efficiency. Our platform is user-friendly, allowing you to navigate through the scheduling process seamlessly.
                                </p>
                            </div>
                            <p>Check our calendar for real-time availability of our healthcare providers. This means you can see which appointments are open and choose the one that fits your schedule without any back-and-forth communication.
                            </p>
                            <div class="special-btn">
									<a href="#" class="btn btn-primary">Book Your Appointment</a>
								</div>
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
							<h2>Steps For <span>New Patients</span></h2>
                            <p>Connect with your chosen healthcare professional at the scheduled time. After your appointment, follow any post-visit instructions provided by the doctor. </p>
                          
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 col-md-6 aos aos-init aos-animate" data-aos="fade-up">
                                <div className="box-detail">
                                    <div className="steps-list-box">
                                        <div className="steps-list-img">
                                            <span>1</span>
                                            <img src={heart_img} className="img-fluid" alt="heart-pulse" />
                                        </div>
                                        <h6>Choose Your Doctor</h6>
                                        <p>Choose the right doctor for your health needs</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 aos aos-init aos-animate" data-aos="fade-up">
                                <div className="box-detail">
                                    <div className="steps-list-box">
                                        <div className="steps-list-img">
                                            <span>2</span>
                                            <img src={heart_img} className="img-fluid" alt="heart-pulse" />
                                        </div>
                                        <h6>Set Appointment</h6>
                                        <p>After choose your preferred doctor, set your appointment.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 aos aos-init aos-animate" data-aos="fade-up">
                                <div className="box-detail">
                                    <div className="steps-list-box">
                                        <div className="steps-list-img">
                                            <span>3</span>
                                            <img src={heart_img} className="img-fluid" alt="heart-pulse" />
                                        </div>
                                        <h6>Consult With Doctor</h6>
                                        <p>Discuss your health concerns with the doctor you choosed.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 aos aos-init aos-animate" data-aos="fade-up">
                                <div className="box-detail">
                                    <div className="steps-list-box">
                                        <div className="steps-list-img">
                                            <span>4</span>
                                            <img src={heart_img} className="img-fluid" alt="heart-pulse" />
                                        </div>
                                        <h6>Get recommendation</h6>
                                        <p>After consulting you receive personalized advice &amp; solution</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>



			
			<div class="container">
				
				<div class="specialities-wrap" style={{}}>
					<div class="row">
						<div class="col-lg-12">
							<div class="special-content">
								<h2>Don’t Make Delay on your Life</h2>
								<h4>Book An Appointment Today</h4>
								<p>If you have a primary care physician, you can reach out to their office and explain that you would like to see a cardiologist. They can typically provide referrals and help you schedule an appointment.</p>
								<div class="special-btn">
									<a href="#" class="btn btn-outline-primary">Start a Consult</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		




             <section className="frequently-section-fifteen">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="section-header-fifteen text-center">
							<h2>Frequently <span>Asked Questions</span></h2>
							<p>What our clients say about us</p>
						</div>
					</div>
				</div>
				<div className="faq-main-cards" id="accordionExample">
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
						<div className="faq-title">
							<a data-bs-toggle="collapse" href="#faqOne" aria-expanded="false"> 
								<span>How do I book an appointment with a doctor?</span>
							</a>
							<div id="faqOne" className="card-collapse collapse show" data-bs-parent="#accordionExample">
								<p>Yes, simply visit our website and log in or create an account. Search for a doctor based on specialization, location, or availability &amp; confirm your booking.</p>
							</div>	
						</div>
					</div>
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">																																
						<div className="faq-title">
							<a className="collapsed" data-bs-toggle="collapse" href="#faqtwo" aria-expanded="false">
								<span>Can I request a specific doctor when booking my appointment?</span>
							</a>
							<div id="faqtwo" className="card-collapse collapse" data-bs-parent="#accordionExample">
								<p>Yes, you can usually request a specific doctor when booking your appointment, though availability may vary based on their schedule.</p>
							</div>
						</div>
					</div>
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
						<div className="faq-title">
							<a className="collapsed" data-bs-toggle="collapse" href="#faqthree" aria-expanded="false">
								<span>What should I do if I need to cancel or reschedule my appointment?</span>							
							</a>
							<div id="faqthree" className="card-collapse collapse" data-bs-parent="#accordionExample">
								<p>If you need to cancel or reschedule your appointment, contact the doctor as soon as possible to inform them and to reschedule for another available time slot.</p>
							</div>
						</div>
					</div>	
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
						<div className="faq-title">
							<a className="collapsed" data-bs-toggle="collapse" href="#faqfour" aria-expanded="false">
								<span>What if I'm running late for my appointment?</span>							
							</a>
							<div id="faqfour" className="card-collapse collapse" data-bs-parent="#accordionExample">
								<p>If you know you will be late, it's courteous to call the doctor's office and inform them. Depending on their policy and schedule, they may be able to accommodate you or reschedule your appointment.</p>
							</div>
						</div>
					</div>
					<div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
						<div className="faq-title">
							<a className="collapsed" data-bs-toggle="collapse" href="#faqfive" aria-expanded="false">
								<span>Can I book appointments for family members or dependents?</span>						
							</a>
							<div id="faqfive" className="card-collapse collapse" data-bs-parent="#accordionExample">
								<p>Yes, in many cases, you can book appointments for family members or dependents. However, you may need to provide their personal information and consent to do so.</p>
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