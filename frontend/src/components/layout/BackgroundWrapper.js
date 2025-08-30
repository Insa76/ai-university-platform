export default function BackgroundWrapper({ children, imageSrc = '/images/hero-background.jpg' }) {
  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url('${imageSrc}') no-repeat center center fixed`,
        backgroundSize: 'cover',
        backgroundColor: 'rgba(255, 255, 255, 0.32)',
      }}
    >
      {children}
    </div>
  );
}