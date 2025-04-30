
import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">About Us</h1>
        <p className="text-muted-foreground">
          AlwaysUp is a simple and reliable website uptime monitoring service. We help you keep track of your website's availability, ensuring you're always aware of any downtime or issues that may arise. Our goal is to provide you with peace of mind, knowing that we're watching over your website's health 24/7. With our easy-to-use platform, you can quickly add and monitor your websites, receiving alerts whenever there's a problem. We offer both free and premium plans to suit your needs, from small personal websites to large-scale enterprise operations.
        </p>
      </section>
    </main>
  );
};

export default AboutUsPage;