import React from "react";
import facilities_img1 from '../assets/img/facilities/facility-01.jpg';
import facilities_img2 from '../assets/img/facilities/facility-02.jpg';
import facilities_img3 from '../assets/img/facilities/facility-03.jpg';
import facilities_img4 from '../assets/img/facilities/facility-04.jpg';
import facilities_img5 from '../assets/img/facilities/facility-05.jpg';
import facilities_img6 from '../assets/img/facilities/facility-06.jpg';
import facilities_img7 from '../assets/img/facilities/facility-07.jpg';
export default function Facilities() {
    return (
        <>
            <section class="facilities-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12 aos aos-init aos-animate" data-aos="fade-up">
                            <div class="section-heading text-center sec-heading-eye">
                                    <h2><span>Top</span> Facilities</h2>
                                    <p>We offer top-tier amenities and services to cater to the needs of our patients,  ensuring their <br/> comfort  and well-being are our top priorities.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="facility-box">
                                <div class="facility-img">
                                    <img src={facilities_img1} alt="eye-test image" class="img-fluid"/>
                                </div>
                                <h6>Consultation rooms</h6>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="facility-box">
                                        <div class="facility-img">
                                            <img src={facilities_img2} alt="eye-test image" class="img-fluid"/>
                                        </div>
                                        <h6>Audio and Video Call Consultation</h6>
                                    </div>
                                </div>
                                <div class="col-md-6 col-sm-6 col-6">
                                    <div class="facility-box">
                                        <div class="facility-img">
                                            <img src={facilities_img3} alt="eye-test image" class="img-fluid"/>
                                        </div>
                                        <h6>Modern Equipments</h6>
                                    </div>
                                </div>
                                <div class="col-md-6 col-sm-6 col-6">
                                    <div class="facility-box">
                                        <div class="facility-img">
                                            <img src={facilities_img4} alt="laboratory" class="img-fluid"/>
                                        </div>
                                        <h6>Laboratory</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-12">
                            <div class="row">
                                <div class="col-md-6 col-sm-6 col-6">
                                    <div class="facility-box">
                                        <div class="facility-img">
                                            <img src={facilities_img5} alt="laboratory" class="img-fluid"/>
                                        </div>
                                        <h6>Optical Store</h6>
                                    </div>
                                </div>
                                <div class="col-md-6 col-sm-6 col-6">
                                    <div class="facility-box">
                                        <div class="facility-img">
                                            <img src={facilities_img6} alt="eye-test image" class="img-fluid"/>
                                        </div>
                                        <h6>Operation Theaters</h6>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="facility-box">
                                        <div class="facility-img">
                                            <img src={facilities_img7} alt="pharmacy-shop" class="img-fluid"/>
                                        </div>
                                        <h6>Pharmacy Shop</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}