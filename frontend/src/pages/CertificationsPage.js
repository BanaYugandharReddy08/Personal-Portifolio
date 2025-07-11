import './CertificationsPage.css';
import { CertificatesProvider } from '../context/CertificatesContext';
import Certificates from '../components/Certificates';

const CertificationsPage = () => (
  <div className="certifications-page">
    <div className="container">
      <CertificatesProvider>
        <Certificates />
      </CertificatesProvider>
    </div>
  </div>
);

export default CertificationsPage;
