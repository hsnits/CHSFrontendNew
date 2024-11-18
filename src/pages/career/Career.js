import React from 'react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import { Col, Container, Row, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import career_img from '../../assets/img/career_with_us2.jpg';
import culture_img from '../../assets/img/culture.jpg';
import { Link } from 'react-router-dom';
import '../career/Career.css';
import { BlogData } from '../../Data';
import { Calendar, MessageSquare, User } from 'react-feather';

const Contact = () => {

    return (
        <>
            <Header />
            <Breadcrumb />
            <section className="contact-section">
                <Container>
                    <Row>
                        <Col lg='7'>
                            <div className="about-box">
                                <h2>Join Caresmart Health Solution</h2>
                                <p className='mt-4 text-justify'>At Caresmart Health Solution, we believe that world-class healthcare should be accessible to everyone, not just the affluent. Our mission is to deliver affordable, Tier-1 healthcare standards to the middle class and financially challenged communities.</p>
                                <p>We are committed to clinical excellence with social relevance, fostering a culture that inspires our talented doctors, nurses, and support staff to perform groundbreaking work every day. If you're passionate about making a difference and want to be part of a team that prioritizes both exceptional care and community impact, we invite you to explore career opportunities with us.</p>
                                <div class="view-all-more">
                                    <Link class="btn btn-primary" to="/">Join Us</Link>
                                </div>
                            </div>
                        </Col>
                        <Col lg='5'>
                            <img src={career_img} className='img-fluid' alt='career-with-us' />
                        </Col>
                    </Row>
                </Container>
            </section>


            <section class="choose-us-section-thirteen common-padding">
                <Container>
                    <Row>
                        <div class="col-lg-12 aos" data-aos="fade-up">
                            <div class="section-header-thirteen">
                                <h2>Our Culture at Caresmart Health Solution</h2>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <Col lg='6'>
                            <div class="choose-us-inner-all aos" data-aos="fade-up">
                                <div class="choose-us-thirteen-img">
                                    <img src={culture_img} alt="Doctor" class="img-fluid" />
                                </div>
                            </div>
                        </Col>
                        <Col lg='6'>
                            <ul>
                                <li class="aos" data-aos="fade-up">
                                    <div class="choose-us-content-thirteen">
                                        <div class="chooseus-contents">
                                        <MessageSquare/>
                                        </div>
                                        <div class="chooseus-content-ryt">
                                            <h5> Patient-Centric Approach</h5>
                                            <p>We prioritize our patients in everything we do. Every decision, every initiative, and every interaction is guided by our commitment to providing exceptional care and improving health outcomes.</p>
                                        </div>
                                    </div>
                                </li>
                                <li class="aos" data-aos="fade-up">
                                    <div class="choose-us-content-thirteen">
                                        <div class="chooseus-contents">
                                        <MessageSquare/>
                                        </div>
                                        <div class="chooseus-content-ryt">
                                            <h5>Inclusivity and Diversity</h5>
                                            <p>We celebrate diversity and foster an inclusive environment where every voice is heard and valued. Our team reflects a range of backgrounds and experiences, enhancing our ability to serve our diverse community.</p>
                                        </div>
                                    </div>
                                </li>
                                <li class="aos" data-aos="fade-up">
                                    <div class="choose-us-content-thirteen">
                                        <div class="chooseus-contents">
                                        <MessageSquare/>
                                        </div>
                                        <div class="chooseus-content-ryt">
                                            <h5>Continuous Learning and Growth</h5>
                                            <p>We are dedicated to the professional development of our staff. We offer ongoing training, mentorship programs, and opportunities for advancement, ensuring our team remains at the forefront of medical excellence.</p>
                                        </div>
                                    </div>
                                </li>
                                <li class="aos" data-aos="fade-up">
                                    <div class="choose-us-content-thirteen">
                                        <div class="chooseus-contents">
                                        <MessageSquare/>
                                        </div>
                                        <div class="chooseus-content-ryt">
                                            <h5>Community Impact</h5>
                                            <p>We are committed to making a positive difference in our community. Our initiatives focus on accessibility, education, and health promotion, ensuring that quality healthcare is available to all.</p>
                                        </div>
                                    </div>
                                </li>
                                <li class="aos" data-aos="fade-up">
                                    <div class="choose-us-content-thirteen">
                                        <div class="chooseus-contents">
                                        <MessageSquare/>
                                        </div>
                                        <div class="chooseus-content-ryt">
                                            <h5>Collaboration and Teamwork</h5>
                                            <p>We believe that teamwork is key to success. Our interdisciplinary teams work closely together, sharing knowledge and expertise to provide the best possible care for our patients.</p>
                                        </div>
                                    </div>
                                </li>
                                <li class="aos" data-aos="fade-up">
                                    <div class="choose-us-content-thirteen">
                                        <div class="chooseus-contents">
                                           <MessageSquare/>
                                        </div>
                                        <div class="chooseus-content-ryt">
                                            <h5>Work-Life Balance</h5>
                                            <p>We understand the importance of maintaining a healthy work-life balance. We support our staff in achieving their personal and professional goals, fostering a culture of well-being.</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </section>


            <section className='mt-4 mb-4'>
                <Container>
                    <Row>
                        <Col lg='12' className='text-center'>
                            <div class="section-header-thirteen">
                                <h2>Join Our Team</h2>
                            </div>
                        </Col>
                        <Form>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="exampleEmail">
                                            Name
                                        </Label>
                                        <Input
                                            id="exampleEmail"
                                            name="email"
                                            placeholder=""
                                            type="email"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="examplePassword">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="examplePassword"
                                            name="password"
                                            placeholder=""
                                            type="password"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="exampleAddress">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="exampleAddress"
                                            name="address"
                                            placeholder=""
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Label for="exampleAddress2">
                                        Experience
                                    </Label>
                                    <Input
                                        id="exampleSelect"
                                        name="select"
                                        type="select"
                                    >
                                        <option>
                                            1
                                        </option>
                                        <option>
                                            2
                                        </option>
                                        <option>
                                            3
                                        </option>
                                        <option>
                                            4
                                        </option>
                                        <option>
                                            5
                                        </option>
                                    </Input>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="exampleAddress">
                                            Designation
                                        </Label>
                                        <Input
                                            id="exampleAddress"
                                            name="address"
                                            placeholder=""
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="exampleAddress">
                                            CV/Resume
                                        </Label>
                                        <Input type='file'
                                            id="exampleAddress"
                                            name="address"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <Label for="exampleAddress">
                                        Write A Message
                                    </Label>
                                    <Input
                                        id="exampleText"
                                        name="text"
                                        type="textarea"
                                    />
                                </Col>
                            </Row>
                            <Button className="view-all-more btn btn-primary mt-4">
                               Apply Now
                            </Button>
                        </Form>
                    </Row>
                </Container>
            </section>

            <section class="articles-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12 aos" data-aos="fade-up">
                            <div class="section-header-one text-center">
                                <h2 class="section-title">CHS Highlights & Updates</h2>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        {BlogData.map((item, key)=>
                        (
                            <div class="col-lg-6 col-md-6 d-flex aos" data-aos="fade-up" key={item.id}>
                            <div class="articles-grid w-100">
                                <div class="articles-info">
                                    <div class="articles-left">
                                        <a href="#">
                                            <div class="articles-img">
                                                <img src={item.blog_img} class="img-fluid" alt="John Doe"/>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="articles-right">
                                        <div class="articles-content">
                                            <ul class="articles-list nav">
                                                <li>
                                                   <User size={15}/> &nbsp; {item.user_name}
                                                </li>
                                                <li>
                                                    <Calendar size={15}/> &nbsp; {item.date}
                                                </li>
                                            </ul>
                                            <h4>
                                                <a href="#">{item.blog_heading}</a>
                                            </h4>
                                            <p>{item.blog_desc}</p>
                                            <a href="#" class="btn">Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                        )}
                      
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Contact;
