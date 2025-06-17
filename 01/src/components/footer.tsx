// src/components/Footer.jsx


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
         

          

         
        </div>

        {/* Copyright */}
        <div
          className="border-t border-gray-800/50 mt-14 pt-8 text-center"
        >
          <a  href="https://github.com/nikhil-rathour/zerocode-fe-assignment " className="text-gray-500 text-sm">
            © {currentYear} Nikhil Rathour. All rights reserved.
          </a>
            </div>
        </div>
    </footer>
  );
};

export default Footer;