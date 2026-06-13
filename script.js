// ─── CONFIGURATION ───────────────────────────────────────────────
// Step 1: Replace with your Supabase project URL and anon key
// const SUPABASE_URL = 'YOUR_SUPABASE_URL';
// const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';


const SUPABASE_URL = 'https://kxadhhkksaahklmtvnhd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LZVg7ci-okdSRkLK3wER_w_WQYH0wv7'; 

// Step 2: Replace with your Formspree form ID (e.g. 'xpzgkwqr')
// const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';

const FORMSPREE_ID = 'mpqelqrl';

// ─────────────────────────────────────────────────────────────────

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn = this.querySelector('.btn-submit');
  const msg = document.getElementById('formMessage');

  btn.textContent = 'Sending...';
  btn.disabled = true;
  msg.className = 'form-message';
  msg.style.display = 'none';

  const data = {
    first_name: document.getElementById('firstName').value.trim(),
    last_name:  document.getElementById('lastName').value.trim(),
    email:      document.getElementById('email').value.trim(),
    phone:      document.getElementById('phone').value.trim(),
    address:    document.getElementById('address').value.trim(),
    service:    document.getElementById('service').value,
    message:    document.getElementById('message').value.trim(),
  };

  try {
    // Save to Supabase
    const { error: dbError } = await supabaseClient.from('contacts').insert([data]);
    if (dbError) throw new Error('Database error: ' + dbError.message);

    // Send email via Formspree
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name:    `${data.first_name} ${data.last_name}`,
        email:   data.email,
        phone:   data.phone,
        address: data.address,
        service: data.service,
        message: data.message,
      }),
    });

    if (!res.ok) throw new Error('Email delivery failed');

    msg.textContent = 'Thank you! Your message has been sent. We will be in touch shortly.';
    msg.className = 'form-message success';
    msg.style.display = 'block';
    document.getElementById('contactForm').reset();

  } catch (err) {
    msg.textContent = 'Something went wrong. Please try again or reach out to us directly.';
    msg.className = 'form-message error';
    msg.style.display = 'block';
    console.error(err);
  } finally {
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }
});
