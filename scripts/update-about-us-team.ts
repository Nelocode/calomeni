import { db, postsPages } from '../src/db/client';
import { eq, and } from 'drizzle-orm';

async function run() {
  console.log('--- Updating About Us page with D. Anthony Calomeni & Alves Finol ---');

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
      <!-- Company logo card -->
      <div style="background: #ffffff; border: 1px solid #eaeaea; border-radius: 8px; padding: 40px 20px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.06); margin-top: 10px;">
        <img src="/assets/imported/logo-big.png" alt="Calomeni & Associates, LLC Logo" style="max-height: 140px; width: auto; margin: 0 auto 20px auto; display: block;" />
        <h3 style="color: #0f3a62; margin: 0; font-size: 1.25rem; font-weight: 700;">Calomeni & Associates, LLC</h3>
        <p style="color: #888; font-size: 0.9rem; margin-top: 5px;">Attorneys and Counselors at Law</p>
      </div>
    </div>
  </div>
  
  <div style="clear: both;"></div>

  <!-- Team Section (DAC & AF Side-by-side) -->
  <div class="section" style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eaeaea; clear: both;">
    <h2 style="font-size: 1.6rem; color: #0f3a62; margin-top: 0; margin-bottom: 25px;">Our Team</h2>
    
    <div class="col span_1_of_2" style="margin-left: 0;">
      <div style="background: #fdfdfd; border: 1px solid #eaeaea; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); min-height: 180px; box-sizing: border-box;">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
          <div style="width: 50px; height: 50px; background: rgba(15, 58, 98, 0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0f3a62; font-size: 1.3rem; font-weight: bold; flex-shrink: 0;">
            DAC
          </div>
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; color: #0f3a62; font-weight: 700; line-height: 1.2;">D. Anthony Calomeni</h3>
            <p style="margin: 4px 0 0 0; font-size: 0.95rem; color: #888; font-weight: 600;">Attorney at Law</p>
          </div>
        </div>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #555; margin: 0;">
          Specializing in immigration procedures and representation, D. Anthony Calomeni is licensed to practice across multiple jurisdictions and has been providing robust legal counsel since 1980.
        </p>
      </div>
    </div>
    
    <div class="col span_1_of_2">
      <div style="background: #fdfdfd; border: 1px solid #eaeaea; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); min-height: 180px; box-sizing: border-box;">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
          <div style="width: 50px; height: 50px; background: rgba(15, 58, 98, 0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0f3a62; font-size: 1.3rem; font-weight: bold; flex-shrink: 0;">
            AF
          </div>
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; color: #0f3a62; font-weight: 700; line-height: 1.2;">Alves Finol</h3>
            <p style="margin: 4px 0 0 0; font-size: 0.95rem; color: #888; font-weight: 600;">Paralegal</p>
          </div>
        </div>
        <p style="font-size: 0.95rem; line-height: 1.6; color: #555; margin: 0;">
          Assisting in immigration case management, client coordination, and legal documentation support. Dedicated to ensuring seamless and efficient case processing.
        </p>
      </div>
    </div>
  </div>

  <div style="clear: both;"></div>

  <!-- Why Choose Us Section -->
  <div class="section" style="margin-top: 40px; clear: both;">
    <h2 style="font-size: 1.6rem; color: #0f3a62; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; margin-bottom: 20px;">Why Choose Us?</h2>
    <ul style="list-style-type: none; padding-left: 0;">
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

  await db
    .update(postsPages)
    .set({ content: aboutHtml.trim() })
    .where(
      and(
        eq(postsPages.slug, 'about-us'),
        eq(postsPages.type, 'page')
      )
    );

  console.log('About Us page updated successfully with both team members!');
  process.exit(0);
}

run();
