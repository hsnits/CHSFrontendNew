import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../services/VirtualConsultation.css";
import { Container, Row, Col } from "react-bootstrap";
import bg_img from "../../assets/img/backgr-2.webp";
import videocall_img from "../../assets/img/services/virutal_call.png";
import { Link } from "react-router-dom";

export default function VirtualConsultation() {
  return (
    <>
      <Header />
      <section
        className="pt-5"
        style={{ backgroundImage: `url(${bg_img})`, backgroundSize: "cover" }}
      >
        <Container>
          <Row className="d-flex align-center">
            <Col lg="6">
              <div className="">
                <div className="et_pb_text_align_left">
                  <div className="et_pb_text_inner">
                    <p className="titles_style">
                      The right care, is wherever you are.
                    </p>
                  </div>
                </div>
                <div className="et_pb_text_align_left">
                  <div className="">
                    <h2 className="main_titles">
                      Consult India's Top Doctors Online.
                    </h2>
                  </div>
                </div>
                <div className="">
                  <Link className="btn btn-primary" to="/doctorList">
                    Consult Now
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <img
                decoding="async"
                src="https://dg0qqklufr26k.cloudfront.net/wp-content/uploads/2023/11/banner-doctors1.webp"
                alt="Online Doctors consultation"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <div className="Patients-section-fifteen">
        <Container>
          <Row>
            <Col lg="6">
              <div className="patients-left-front patients-left-img">
                <img src={videocall_img} alt="Patients" className="img-fluid" />
              </div>
            </Col>
            <Col lg="6">
              <div className="section-header-fifteen section-header-fifteenpatient">
                <h2>
                  Virtual <span>Consultations</span>
                </h2>
                <p className="text-justify">
                  Virtual consultations allow doctors to see more patients in
                  less time since they eliminate the need for travel and waiting
                  room time.
                </p>
                <p>
                  {" "}
                  At CHS Caresmart Health Solution, we are committed to
                  providing you with accessible and convenient healthcare
                  options. Our virtual consultations allow you to connect with
                  our healthcare professionals from the comfort of your home,
                  ensuring you receive the care you need without the hassle of
                  travel.
                </p>
              </div>

              <div class="special-btn">
                <Link className="btn btn-primary" to="/doctorList">
                  Book Your Appointment
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <section className="et_pb_section et_pb_section_4 why_mfine et_pb_with_background et_section_regular">
        <Container>
          <div className="et_pb_row et_pb_row_8">
            <div className="et_pb_column et_pb_column_4_4 et_pb_column_11 et_pb_css_mix_blend_mode_passthrough et-last-child">
              <div className="et_pb_module et_pb_text et_pb_text_10 et_pb_bg_layout_light  et_pb_text_align_left">
                <div className="et_pb_text_inner">
                  <h4>Why Consult Online on CHS Caresmart Health Solution</h4>
                </div>
              </div>
            </div>
          </div>
          <Row>
            <Col lg="6" className="mb-3">
              <div className="et_pb_module et_pb_text et_pb_text_11 et_pb_bg_layout_light  et_pb_text_align_left">
                <div className="et_pb_text_inner">
                  <div className="icon_style">
                    <p>
                      <img
                        decoding="async"
                        class="alignnone size-full wp-image-67471"
                        src="https://assets.mfine.co/api/contentservice/attachments/download/common/website/accessibility.svg"
                        alt=""
                        width="150"
                        height="150"
                      />
                    </p>
                    <h5>Accessibility</h5>
                    <p className="read-more-wrap">
                      With 30+ specialities, 4000+ Doctors and partnerships with
                      more than 600 renowned hospitals across the nation,
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6" className="mb-3">
              <div className="et_pb_module et_pb_text et_pb_text_12 et_pb_bg_layout_light  et_pb_text_align_left">
                <div className="et_pb_text_inner">
                  <div className="icon_style">
                    <p>
                      <img
                        decoding="async"
                        class="alignnone size-full wp-image-67471"
                        src="https://assets.mfine.co/api/contentservice/attachments/download/common/website/convenience.svg"
                        alt=""
                        width="150"
                        height="150"
                      />
                    </p>
                    <h5>Convenience</h5>
                    <p class="read-more-wrap">
                      Most patients prefer online consultations due to the easy
                      and convenient process involved. With every 4th
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6" className="mb-3">
              <div className="et_pb_module et_pb_text et_pb_text_13 et_pb_bg_layout_light  et_pb_text_align_left">
                <div className="et_pb_text_inner">
                  <div className="icon_style">
                    <p>
                      <img
                        decoding="async"
                        class="alignnone size-full wp-image-67471"
                        src="https://assets.mfine.co/api/contentservice/attachments/download/common/website/security.svg"
                        alt=""
                        width="150"
                        height="150"
                      />
                    </p>
                    <h5>Security and privacy</h5>
                    <p className="read-more-wrap">
                      Since online consultations in India are still picking up,
                      it comes with popular belief that your medical information
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6" className="mb-3">
              <div className="et_pb_module et_pb_text et_pb_text_14 et_pb_bg_layout_light  et_pb_text_align_left">
                <div className="et_pb_text_inner">
                  <div className="icon_style">
                    <p>
                      <img
                        loading="lazy"
                        decoding="async"
                        class="alignnone size-full wp-image-67471"
                        src="https://assets.mfine.co/api/contentservice/attachments/download/common/website/confidentiality.svg"
                        alt=""
                        width="150"
                        height="150"
                      />
                    </p>
                    <h5>Complete confidentiality</h5>
                    <p className="read-more-wrap">
                      Our intuitive platform facilitates a quick online doctor
                      chat about any concern, with complete confidentiality.
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg="6" className="mb-3">
              <div className="et_pb_module et_pb_text et_pb_text_15 et_pb_bg_layout_light  et_pb_text_align_left">
                <div className="et_pb_text_inner">
                  <div className="icon_style">
                    <p>
                      <img
                        loading="lazy"
                        decoding="async"
                        class="alignnone size-full wp-image-67471"
                        src="https://assets.mfine.co/api/contentservice/attachments/download/common/website/online%20docs.svg"
                        alt=""
                        width="150"
                        height="150"
                      />
                    </p>
                    <h5>Certified Online Doctors</h5>
                    <p className="read-more-wrap">
                      We have a broad network of top specialized doctors, with
                      over 10 years of experience to provide you with quality
                      care.
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6" className="mb-3">
              <div className="et_pb_module et_pb_text et_pb_text_16 et_pb_bg_layout_light  et_pb_text_align_left">
                <div className="et_pb_text_inner">
                  <div class="icon_style">
                    <p>
                      <img
                        loading="lazy"
                        decoding="async"
                        class="alignnone size-full wp-image-67471"
                        src="https://assets.mfine.co/api/contentservice/attachments/download/common/website/quality.svg"
                        alt=""
                        width="150"
                        height="150"
                      />
                    </p>
                    <h5>Affordability</h5>
                    <p className="read-more-wrap">
                      Online consultations help you save money since it costs a
                      fraction of the price compared to physically visiting a
                      doctor.
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <div className="et_pb_section et_pb_section_6 oc_work et_section_regular">
        <div className="et_pb_row et_pb_row_13">
          <div className="et_pb_column et_pb_column_4_4 et_pb_column_21 et_pb_css_mix_blend_mode_passthrough et-last-child">
            <div
              id="headings"
              class="et_pb_module et_pb_text et_pb_text_20 et_pb_bg_layout_light  et_pb_text_align_left"
            >
              <div className="et_pb_text_inner">
                <h2>How does an online doctor consultation work?</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="et_pb_row et_pb_row_14 odc_rows">
          <div className="et_pb_column et_pb_column_1_3 et_pb_column_22    et_pb_css_mix_blend_mode_passthrough">
            <div className="et_pb_module et_pb_text et_pb_text_21 et_pb_bg_layout_light  et_pb_text_align_left">
              <div className="et_pb_text_inner">
                <p>
                  <img
                    loading="lazy"
                    decoding="async"
                    className="size-full wp-image-106109 aligncenter"
                    src="https://dg0qqklufr26k.cloudfront.net/wp-content/uploads/2023/10/specility.webp"
                    alt="doctor consultation"
                    width="85"
                    height="85"
                  />
                </p>
              </div>
            </div>
          </div>
          <div className="et_pb_column et_pb_column_2_3 et_pb_column_23    et_pb_css_mix_blend_mode_passthrough et-last-child">
            <div className="et_pb_module et_pb_text et_pb_text_22 et_pb_bg_layout_light  et_pb_text_align_left">
              <div className="et_pb_text_inner">
                <div className="od_sec">
                  <h3>Choose a speciality</h3>
                  <p>
                    Choose a specialty based on the medical condition you have.
                    If you are unsure, you can consult with a general physician
                    to guide you through your health condition. For COVID-19
                    consults, you can chat with a pulmonologist to analyse your
                    Antibody test, RT-PCR test results, or help you with a
                    COVID-19 treatment plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="et_pb_row et_pb_row_15 odc_rows">
          <div className="et_pb_column et_pb_column_1_3 et_pb_column_24    et_pb_css_mix_blend_mode_passthrough">
            <div className="et_pb_module et_pb_text et_pb_text_23 et_pb_bg_layout_light  et_pb_text_align_left">
              <div className="et_pb_text_inner">
                <p>
                  <img
                    loading="lazy"
                    decoding="async"
                    className="size-full wp-image-106107 aligncenter"
                    src="https://dg0qqklufr26k.cloudfront.net/wp-content/uploads/2023/10/choosedoc-1.webp"
                    alt="doctor consultation"
                    width="85"
                    height="85"
                  />
                </p>
              </div>
            </div>
          </div>
          <div className="et_pb_column et_pb_column_2_3 et_pb_column_25    et_pb_css_mix_blend_mode_passthrough et-last-child">
            <div className="et_pb_module et_pb_text et_pb_text_24 et_pb_bg_layout_light  et_pb_text_align_left">
              <div className="et_pb_text_inner">
                <div className="od_sec">
                  <h3>Choose your doctor</h3>
                  <p>
                    Choose your doctor based on your preferences. Few parameters
                    you can consider are the years of experience, qualification,
                    languages they speak, hospitals they work in, and the
                    location they are based out of.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="et_pb_row et_pb_row_16 odc_rows">
          <div className="et_pb_column et_pb_column_1_3 et_pb_column_26    et_pb_css_mix_blend_mode_passthrough">
            <div className="et_pb_module et_pb_text et_pb_text_25 et_pb_bg_layout_light  et_pb_text_align_left">
              <div className="et_pb_text_inner">
                <p>
                  <img
                    loading="lazy"
                    decoding="async"
                    className="size-full wp-image-106108 aligncenter"
                    src="https://dg0qqklufr26k.cloudfront.net/wp-content/uploads/2023/10/doc-online1.webp"
                    alt="doctor consultation"
                    width="85"
                    height="85"
                  />
                </p>
              </div>
            </div>
          </div>
          <div className="et_pb_column et_pb_column_2_3 et_pb_column_27    et_pb_css_mix_blend_mode_passthrough et-last-child">
            <div className="et_pb_module et_pb_text et_pb_text_26 et_pb_bg_layout_light  et_pb_text_align_left">
              <div className="et_pb_text_inner">
                <div className="od_sec">
                  <h3>Talk to a doctor online</h3>
                  <p>
                    Consult a doctor online either through chat, audio call, or
                    video call and address your health problems. Apart from
                    medical advice, the doctor will also give lifestyle tips for
                    your condition, guidelines on COVID-19 Home care, or
                    guidelines on COVID-19 treatment and share a prescription.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="odc_hide" className="et_pb_row et_pb_row_17 odc_rows">
          <div className="et_pb_column et_pb_column_1_3 et_pb_column_28    et_pb_css_mix_blend_mode_passthrough">
            <div className="et_pb_module et_pb_text et_pb_text_27 et_pb_bg_layout_light  et_pb_text_align_left">
              <div className="et_pb_text_inner">
                <p>
                  <img
                    loading="lazy"
                    decoding="async"
                    className="size-full aligncenter"
                    src="https://dg0qqklufr26k.cloudfront.net/wp-content/uploads/2023/10/book-lab-test-1.webp"
                    alt="doctor consultation"
                    width="85"
                    height="85"
                    srcset="https://dg0qqklufr26k.cloudfront.net/wp-content/uploads/2023/10/book-lab-test-1.webp 192w, https://dg0qqklufr26k.cloudfront.net/wp-content/uploads/2023/10/book-lab-test-1-150x150.webp 150w"
                  />
                </p>
              </div>
            </div>
          </div>
          <div className="et_pb_column et_pb_column_2_3 et_pb_column_29    et_pb_css_mix_blend_mode_passthrough et-last-child">
            <div className="et_pb_module et_pb_text et_pb_text_28 et_pb_bg_layout_light  et_pb_text_align_left">
              <div className="et_pb_text_inner">
                <div className="od_sec">
                  <h3>Book Lab Tests online</h3>
                  <p>
                    Get any lab test done, from the safety &amp; comfort of your
                    home. Your lab reports will be available to you on the app
                    and a top doctor will analyse them, for free.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="et_pb_row et_pb_row_18 odc_rows">
          <div className="et_pb_column et_pb_column_1_3 et_pb_column_30    et_pb_css_mix_blend_mode_passthrough">
            <div className="et_pb_module et_pb_text et_pb_text_29 et_pb_bg_layout_light  et_pb_text_align_left">
              <div className="et_pb_text_inner">
                <p>
                  <img
                    loading="lazy"
                    decoding="async"
                    className="size-full wp-image-106106 aligncenter"
                    src="https://dg0qqklufr26k.cloudfront.net/wp-content/uploads/2023/10/buy-medicine.webp"
                    alt="doctor consultation"
                    width="85"
                    height="85"
                    srcset="https://dg0qqklufr26k.cloudfront.net/wp-content/uploads/2023/10/buy-medicine.webp 197w, https://dg0qqklufr26k.cloudfront.net/wp-content/uploads/2023/10/buy-medicine-150x150.webp 150w"
                    sizes="(max-width: 85px) 100vw, 85px"
                  />
                </p>
              </div>
            </div>
          </div>
          <div className="et_pb_column et_pb_column_2_3 et_pb_column_31    et_pb_css_mix_blend_mode_passthrough et-last-child">
            <div className="et_pb_module et_pb_text et_pb_text_30 et_pb_bg_layout_light  et_pb_text_align_left">
              <div className="et_pb_text_inner">
                <div className="od_sec">
                  <h3>Buy medicines online</h3>
                  <p>
                    You can buy medicines online through our app and get them
                    delivered to your doorstep on the same day, all without you
                    having to step out of home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
