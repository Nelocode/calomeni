import { db, postsPages } from '../src/db/client';
import { eq, and } from 'drizzle-orm';

async function run() {
  console.log('--- Updating About Us Content in DB ---');
  
  const aboutHtml = `
<div class="page-content">
  <div class="section" style="margin-bottom: 40px; clear: both;">
    <div class="col span_1_of_2" style="margin-left: 0;">
      <h2 style="font-size: 1.8rem; line-height: 1.4; color: #0f3a62; margin-top: 0;">Con licencia desde 1980 en múltiples jurisdicciones.</h2>
      <p style="font-size: 1.1rem; line-height: 1.7; color: #555; margin-top: 15px;">
        En <strong>Calomeni & Associates, LLC</strong>, entendemos que enfrentarse a un proceso legal de inmigración, familiar o de negocios puede ser un momento crucial en su vida. Trabajamos, procesamos y realizamos todos los trámites de inmigración con absoluta seriedad y profesionalismo.
      </p>
      <p style="font-size: 1.1rem; line-height: 1.7; color: #555;">
        Guiados por la experiencia y el compromiso, le brindamos asesoría y representación legal personalizada para que usted y su familia tengan la tranquilidad que merecen.
      </p>
    </div>
    <div class="col span_1_of_2">
      <img src="/assets/imported/about-us-team.jpg" alt="Nuestro Equipo de Abogados" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); margin-top: 10px;" />
    </div>
  </div>
  
  <div style="clear: both;"></div>

  <div class="section" style="margin-top: 30px;">
    <h2 style="font-size: 1.6rem; color: #0f3a62; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">¿Por qué elegirnos?</h2>
    <ul style="list-style-type: none; padding-left: 0; margin-top: 20px;">
      <li style="margin-bottom: 12px; font-size: 1.1rem; color: #555;">
        <strong style="color: #0f3a62;">✓ Experiencia Comprobada:</strong> Más de 40 años de trayectoria legal activa.
      </li>
      <li style="margin-bottom: 12px; font-size: 1.1rem; color: #555;">
        <strong style="color: #0f3a62;">✓ Atención en Español:</strong> Todo nuestro personal habla español fluido para su comodidad.
      </li>
      <li style="margin-bottom: 12px; font-size: 1.1rem; color: #555;">
        <strong style="color: #0f3a62;">✓ Enfoque Humano:</strong> Nos preocupamos sinceramente por la estabilidad y el éxito de cada caso.
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

  console.log('About Us page updated successfully!');
  process.exit(0);
}

run();
