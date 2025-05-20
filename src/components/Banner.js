import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';

const Banner = () => {
  return (
    <section className="section section-search">
      <Container fluid>
        <div className="banner-wrapper">
        <div className="banner-header text-center text-white aos aos-init aos-animate" data-aos="fade-up">
            <h1 className='text-white'>Search Doctor, Make an Appointment</h1>
            <p className='text-white'>Discover the best doctors, clinic &amp; hospital the city nearest to you.</p>
            </div>
            <div className="search-box">
           <Form>
            {/* <div className="mb-3 search-location aos aos-init aos-animate" data-aos="fade-up">
            <input type="text" className="form-control" placeholder="Search Location"/>
            <span className="form-text text-white">Based on your Location</span>
            </div> */}
            <div className="mb-3 search-info aos aos-init aos-animate" data-aos="fade-up">
            {/* <input type="text" className="form-control" placeholder="Search Doctors, Clinics, Hospitals, Diseases Etc"/>
            <span className="form-text text-white">Ex : Dental or Sugar Check up etc</span> */}
            </div>
            {/* <button type="submit" className="btn btn-primary search-btn mt-0 aos aos-init aos-animate" data-aos="fade-up"><i className="fas fa-search"></i> <span>Search</span></button> */}
            </Form>
            </div>
        </div>
      </Container>
    </section>
  );
};

export default Banner;
