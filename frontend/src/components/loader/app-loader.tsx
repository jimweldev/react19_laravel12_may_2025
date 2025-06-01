const AppLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* center */}
      <img className="w-32" src="/images/app-logo.jpg" alt="Logo" />

      {/* bottom */}
      <div className="absolute bottom-8 flex flex-col gap-4">
        <p className="text-muted-foreground text-center font-semibold">from</p>
        <img className="w-24" src="/images/company-logo-long.png" alt="Logo" />
      </div>
    </div>
  );
};

export default AppLoader;
