import Certificates from '../components/Certificates';
import { CertificatesProvider } from '../context/CertificatesContext';

const CertificationsPage = () => {
  return (
  <div className="certifications-page">
    <div className="container">
      <CertificatesProvider>
        <Certificates />
      </CertificatesProvider>
    </div>
  </div>
  )
};
export default CertificationsPage;