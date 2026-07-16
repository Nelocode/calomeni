import { db, postsPages } from '../src/db/client';
import { eq, and } from 'drizzle-orm';

async function run() {
  console.log('--- Translating All Pages to English & Adding Icons ---');

  // 1. About Us
  const aboutHtml = `
<div class="page-content">
  <div class="section" style="margin-bottom: 40px; clear: both;">
    <div class="col span_1_of_2" style="margin-left: 0;">
      <h2 style="font-size: 1.8rem; line-height: 1.4; color: #0f3a62; margin-top: 0;">Licensed Since 1980 in Multiple Jurisdictions.</h2>
      <p style="font-size: 1.1rem; line-height: 1.7; color: #555; margin-top: 15px;">
        At <strong>Calomeni & Associates, LLC</strong>, we understand that facing an immigration, family, or business legal process can be a life-changing moment. We work, process, and handle all immigration procedures with the utmost seriousness and professionalism.
      </p>
      <p style="font-size: 1.1rem; line-height: 1.7; color: #555;">
        Guided by experience and commitment, we provide personalized legal counsel and representation to give you and your family the peace of mind you deserve.
      </p>
    </div>
    <div class="col span_1_of_2">
      <img src="/assets/imported/about-us-team.jpg" alt="Our Legal Team" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); margin-top: 10px;" />
    </div>
  </div>
  
  <div style="clear: both;"></div>

  <div class="section" style="margin-top: 30px;">
    <h2 style="font-size: 1.6rem; color: #0f3a62; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">Why Choose Us?</h2>
    <ul style="list-style-type: none; padding-left: 0; margin-top: 20px;">
      <li style="margin-bottom: 15px; font-size: 1.1rem; color: #555; display: flex; align-items: center; gap: 12px;">
        <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 1.3rem;"></i>
        <span><strong style="color: #0f3a62;">Proven Experience:</strong> Over 40 years of active legal practice.</span>
      </li>
      <li style="margin-bottom: 15px; font-size: 1.1rem; color: #555; display: flex; align-items: center; gap: 12px;">
        <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 1.3rem;"></i>
        <span><strong style="color: #0f3a62;">Bilingual Support:</strong> Our entire staff is fully bilingual (English and Spanish) for your convenience.</span>
      </li>
      <li style="margin-bottom: 15px; font-size: 1.1rem; color: #555; display: flex; align-items: center; gap: 12px;">
        <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 1.3rem;"></i>
        <span><strong style="color: #0f3a62;">Client-Centered:</strong> We genuinely care about the stability and success of each client's case.</span>
      </li>
    </ul>
  </div>
</div>
`;

  // 2. Services
  const servicesHtml = `
<div class="page-content">
  <p style="font-size: 1.15rem; color: #555; line-height: 1.8; text-align: center; max-width: 700px; margin: 0 auto 40px auto;">
    We offer comprehensive legal counsel and representation across multiple practice areas. Our commitment is to provide effective solutions and professional support from start to finish.
  </p>

  <div class="services-grid">
    <div class="service-card">
      <img src="/assets/imported/immigration-law.jpg" alt="Immigration Cases" class="service-image" />
      <div class="service-content">
        <h3>
          <i class="fas fa-passport" style="color: #0f3a62; margin-right: 8px;"></i>
          Immigration Cases
        </h3>
        <p>
          We process family petitions, work visas, representation in immigration court, asylum applications, citizenship, and legal residency procedures in the United States.
        </p>
      </div>
    </div>

    <div class="service-card">
      <img src="/assets/imported/accident-law.jpg" alt="Auto & Work Accidents" class="service-image" />
      <div class="service-content">
        <h3>
          <i class="fas fa-car-crash" style="color: #0f3a62; margin-right: 8px;"></i>
          Auto & Work Accidents
        </h3>
        <p>
          We help you secure maximum compensation for personal injuries sustained in traffic or workplace accidents, managing all medical claims and insurance company negotiations.
        </p>
      </div>
    </div>

    <div class="service-card">
      <img src="/assets/imported/family-law.jpg" alt="Family Law" class="service-image" />
      <div class="service-content">
        <h3>
          <i class="fas fa-users" style="color: #0f3a62; margin-right: 8px;"></i>
          Family Law
        </h3>
        <p>
          We provide guidance in divorce, child custody, child support, adoptions, prenuptial agreements, and family mediation with utmost discretion and empathy.
        </p>
      </div>
    </div>

    <div class="service-card">
      <img src="/assets/imported/business-law.jpg" alt="Business Law" class="service-image" />
      <div class="service-content">
        <h3>
          <i class="fas fa-briefcase" style="color: #0f3a62; margin-right: 8px;"></i>
          Business Law
        </h3>
        <p>
          Consultation for setting up corporations, LLCs, drafting and reviewing commercial contracts, business acquisitions, and resolving corporate disputes.
        </p>
      </div>
    </div>
  </div>
</div>
`;

  // 3. Reviews
  const reviewsHtml = `
<div class="page-content">
  <p style="font-size: 1.15rem; color: #555; line-height: 1.8; text-align: center; max-width: 700px; margin: 0 auto 30px auto;">
    Hear directly from our clients about their experiences working with Calomeni & Associates, LLC.
  </p>

  <div style="max-width: 700px; margin: 0 auto 40px auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
    <video class="elementor-video" src="/assets/imported/testimonial_calomeni.mp4" controls style="width: 100%; display: block;" preload="metadata"></video>
  </div>

  <div class="reviews-section" style="max-width: 800px; margin: 40px auto;">
    <div class="review-item" style="background: #fdfdfd; border: 1px solid #eaeaea; border-radius: 8px; padding: 25px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
      <div style="color: #f1c40f; margin-bottom: 12px; font-size: 1.2rem;">
        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
      </div>
      <p style="font-style: italic; font-size: 1.05rem; color: #555; line-height: 1.6; margin-bottom: 10px;">
        "Excellent representation! They helped me obtain my legal residency without any delays. They speak perfect Spanish and explained every step clearly."
      </p>
      <strong style="color: #0f3a62; font-size: 0.95rem;">- Maria G., Resident Visa Client</strong>
    </div>

    <div class="review-item" style="background: #fdfdfd; border: 1px solid #eaeaea; border-radius: 8px; padding: 25px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
      <div style="color: #f1c40f; margin-bottom: 12px; font-size: 1.2rem;">
        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
      </div>
      <p style="font-style: italic; font-size: 1.05rem; color: #555; line-height: 1.6; margin-bottom: 10px;">
        "Very professional law firm. They represented me in a work accident claim and negotiated a very fair settlement. Highly recommended."
      </p>
      <strong style="color: #0f3a62; font-size: 0.95rem;">- John D., Accident Claim Client</strong>
    </div>
  </div>
</div>
`;

  // 4. Contact Us
  const contactHtml = `
<div class="page-content">
  <div class="section" style="margin-bottom: 40px; clear: both;">
    <div class="col span_1_of_2" style="margin-left: 0;">
      <h2 style="font-size: 1.6rem; color: #0f3a62; margin-top: 0;">Send Us a Message</h2>
      <p style="color: #555; margin-bottom: 20px;">If you have any questions, you can contact us to provide you a personalized attention. We will reply as soon as possible. Thank you.</p>
      
      <form class="elementor-form" method="post" name="Contact Form" aria-label="Contact Form">
        <label for="form-field-name" style="font-weight: 600; color: #0f3a62; display: block; margin-bottom: 6px;">Name</label>
        <input type="text" name="form_fields[name]" id="form-field-name" placeholder="Your Name" required>
        
        <label for="form-field-email" style="font-weight: 600; color: #0f3a62; display: block; margin-bottom: 6px;">Email Address</label>
        <input type="email" name="form_fields[email]" id="form-field-email" placeholder="Your Email" required>
        
        <label for="form-field-phone" style="font-weight: 600; color: #0f3a62; display: block; margin-bottom: 6px;">Phone Number</label>
        <input type="tel" name="form_fields[phone]" id="form-field-phone" placeholder="Your Phone Number" required>
        
        <label for="form-field-message" style="font-weight: 600; color: #0f3a62; display: block; margin-bottom: 6px;">Message</label>
        <textarea name="form_fields[message]" id="form-field-message" rows="4" placeholder="How can we help you?" required></textarea>
        
        <button type="submit">Send Message</button>
      </form>
    </div>

    <div class="col span_1_of_2">
      <h2 style="font-size: 1.6rem; color: #0f3a62; margin-top: 0; margin-bottom: 20px;">Contact Information</h2>
      
      <a class="contact-card-link" href="https://maps.app.goo.gl/GsSRh38Qj4mtAdsZ9" target="_blank" rel="noopener noreferrer">
        <span class="icon-wrap"><i class="fas fa-map-marker-alt"></i></span>
        <div class="card-info">
          <h3>Office Address</h3>
          <p>4132 Steve Reynolds Blvd<br>Norcross, GA 30093</p>
        </div>
      </a>

      <a class="contact-card-link" href="tel:+16785853606" target="_blank" rel="noopener noreferrer">
        <span class="icon-wrap"><i class="fas fa-phone-alt"></i></span>
        <div class="card-info">
          <h3>Phone Number</h3>
          <p>(770) 691-0212</p>
        </div>
      </a>

      <div class="contact-card-link">
        <span class="icon-wrap"><i class="fas fa-fax"></i></span>
        <div class="card-info">
          <h3>Fax Number</h3>
          <p>(678) 585-3626</p>
        </div>
      </div>

      <a class="contact-card-link" href="mailto:office.calomeni@gmail.com" target="_blank" rel="noopener noreferrer">
        <span class="icon-wrap"><i class="fas fa-envelope"></i></span>
        <div class="card-info">
          <h3>Email Address</h3>
          <p>office.calomeni@gmail.com</p>
        </div>
      </a>
    </div>
  </div>
</div>
`;

  // Update DB
  await db.update(postsPages).set({ content: aboutHtml.trim() }).where(and(eq(postsPages.slug, 'about-us'), eq(postsPages.type, 'page')));
  await db.update(postsPages).set({ content: servicesHtml.trim() }).where(and(eq(postsPages.slug, 'services'), eq(postsPages.type, 'page')));
  await db.update(postsPages).set({ content: reviewsHtml.trim() }).where(and(eq(postsPages.slug, 'reviews'), eq(postsPages.type, 'page')));
  await db.update(postsPages).set({ content: contactHtml.trim() }).where(and(eq(postsPages.slug, 'contact-us'), eq(postsPages.type, 'page')));

  console.log('All internal pages updated in English successfully!');
  process.exit(0);
}

run();
