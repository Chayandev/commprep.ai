import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Link,
} from "@mui/material";
import {
  Phone,
  Mail,
  Linkedin as LinkedinIcon,
  Github as GithubIcon,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";

const ContactCard = ({ icon, title, content, action, link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    const msg = `Copied to clipboard\n, ${title}: ${content}`;
    toast.success(msg, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div className="bg-white shadow-lg hover:shadow-2xl p-4 rounded-lg border border-gray-200 transition-all transform hover:scale-105 hover:ease-spring duration-300">
      <div className="flex items-center gap-4">
        <div className="bg-teal-100 p-3 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div>
          <Typography variant="h6" className="font-semibold text-gray-800">
            {title}
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            {content}
          </Typography>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        {action === "copy" ? (
          <button onClick={handleCopy} color="primary">
            {copied ? "Copied!" : <Copy className="h-6 w-6 text-primary" />}
          </button>
        ) : (
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-500"
          >
            <ExternalLink className="h-6 w-6 text-primary" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      <main className="w-[90%] lg:w-[80%] mx-auto py-6">
        {/* Header Section */}
        <Box textAlign="center" py={6}>
          <Typography variant="h3" fontWeight="bold" color="text.primary">
            Let's Connect
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mt={2}
            maxWidth="600px"
            mx="auto"
          >
            Reach out to us via any of the methods below. We're always here to
            assist you.
          </Typography>
        </Box>

        {/* Contact Cards Section with Flexbox */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <Box flexBasis="45%">
            <ContactCard
              icon={<Phone color="teal" />}
              title="Phone"
              content="7478637540"
              action="copy"
            />
          </Box>
          <Box flexBasis="45%">
            <ContactCard
              icon={<Mail color="teal" />}
              title="Email"
              content="commprep.ai@gmail.com"
              action="link"
              link="mailto:commprep.ai@gmail.com"
            />
          </Box>
          <Box flexBasis="45%">
            <ContactCard
              icon={<LinkedinIcon color="teal" />}
              title="LinkedIn"
              content="linkedin.com/in/chayandev-bera"
              action="link"
              link="https://linkedin.com/in/chayandev-bera"
            />
          </Box>
          <Box flexBasis="45%">
            <ContactCard
              icon={<GithubIcon color="teal" />}
              title="GitHub"
              content="github.com/Chayandev"
              action="link"
              link="https://github.com/Chayandev"
            />
          </Box>
        </div>

        {/* Map Section
          <Box mt={8} textAlign="center">
            <Card>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ aspectRatio: "16 / 9", overflow: "hidden" }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.0824614604!2d88.43000531495994!3d22.50826998521039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0271f0f6b0e6c7%3A0x7e7c2c1e8a0c5c3b!2sIndian%20Institute%20of%20Technology%20Kharagpur!5e0!3m2!1sen!2sin!4v1621234567890!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Our Virtual Office Location"
                  ></iframe>
                </Box>
              </CardContent>
            </Card>
            <Typography mt={2} variant="body2" color="text.secondary">
              <MapPin color="teal" /> Our Virtual Office – Connecting Globally
            </Typography>
          </Box> */}
      </main>
    </div>
  );
}
