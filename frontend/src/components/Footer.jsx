import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ marginTop: 'auto' }}>
      <div className="f-info" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: '8rem',
        backgroundColor: '#ebebeb'
      }}>
        <div className="f-info-socials" style={{ marginBottom: '0.5rem' }}>
          <i className="fa-brands fa-facebook" style={{ fontSize: '1.2rem', marginRight: '2rem' }}></i>
          <i className="fa-brands fa-instagram" style={{ fontSize: '1.2rem', marginRight: '2rem' }}></i>
          <i className="fa-brands fa-x-twitter" style={{ fontSize: '1.2rem', marginRight: '2rem' }}></i>
          <i className="fa-brands fa-linkedin" style={{ fontSize: '1.2rem', marginRight: '2rem' }}></i>
        </div>
        <div className="f-info-brand">&copy; Wanderlust Private Limited</div>
        <div className="f-info-links" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1.5rem',
          width: 'auto',
          marginTop: '0.5rem'
        }}>
          <Link to="/terms" style={{ textDecoration: 'none', color: '#222222' }}>Terms and conditions</Link>
          <Link to="/privacy" style={{ textDecoration: 'none', color: '#222222' }}>Privacy policy</Link>
        </div>
      </div>
    </footer>
  );
}
