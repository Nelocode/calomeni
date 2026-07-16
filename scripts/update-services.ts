import { db, postsPages } from '../src/db/client';
import { eq, and } from 'drizzle-orm';

async function run() {
  console.log('--- Updating Services Content in DB ---');
  
  const servicesHtml = `
<div class="page-content">
  <p style="font-size: 1.15rem; color: #555; line-height: 1.8; text-align: center; max-width: 700px; margin: 0 auto 40px auto;">
    Ofrecemos asesoría y representación legal integral en múltiples áreas del derecho. Nuestro compromiso es brindarle soluciones efectivas y un acompañamiento profesional de principio a fin.
  </p>

  <div class="services-grid">
    <div class="service-card">
      <img src="/assets/imported/immigration-law.jpg" alt="Casos de Inmigración" class="service-image" />
      <div class="service-content">
        <h3>Casos de Inmigración</h3>
        <p>
          Procesamos peticiones familiares, visas de trabajo, representación en corte de inmigración, solicitudes de asilo, ciudadanía y trámites de residencia legal en EE.UU.
        </p>
      </div>
    </div>

    <div class="service-card">
      <img src="/assets/imported/accident-law.jpg" alt="Accidentes de Auto y de Trabajo" class="service-image" />
      <div class="service-content">
        <h3>Accidentes de Auto y Trabajo</h3>
        <p>
          Le ayudamos a obtener la máxima compensación por lesiones personales sufridas en accidentes de tránsito o en el área de trabajo, gestionando reclamos médicos y de seguros.
        </p>
      </div>
    </div>

    <div class="service-card">
      <img src="/assets/imported/family-law.jpg" alt="Derecho de Familia" class="service-image" />
      <div class="service-content">
        <h3>Derecho de Familia</h3>
        <p>
          Brindamos asistencia en divorcios, custodia de hijos, manutención alimentaria, adopciones, acuerdos prematrimoniales y mediación familiar con discreción y empatía.
        </p>
      </div>
    </div>

    <div class="service-card">
      <img src="/assets/imported/business-law.jpg" alt="Derecho Comercial" class="service-image" />
      <div class="service-content">
        <h3>Derecho Comercial</h3>
        <p>
          Asesoría para creación de corporaciones, LLCs, redacción y revisión de contratos comerciales, adquisiciones de negocios y resolución de disputas corporativas.
        </p>
      </div>
    </div>
  </div>
</div>
`;

  await db
    .update(postsPages)
    .set({ content: servicesHtml.trim() })
    .where(
      and(
        eq(postsPages.slug, 'services'),
        eq(postsPages.type, 'page')
      )
    );

  console.log('Services page updated successfully!');
  process.exit(0);
}

run();
