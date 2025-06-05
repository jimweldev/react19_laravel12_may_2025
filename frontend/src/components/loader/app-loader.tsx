const AppLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <img className="w-32" src="/images/app-logo.jpg" alt="App Logo" />

      <div className="absolute bottom-8 flex flex-col gap-4">
        <p className="text-muted-foreground text-center font-semibold">from</p>
        <img
          className="w-24"
          src="/images/company-logo-long.png"
          alt="Company Logo"
        />
      </div>
    </div>
  );
};

export default AppLoader;
