function Home({ currentUser, setIsLoading }) {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center ">
            <h1 className="text-center "></h1>
            {currentUser !== null && setIsLoading === false && (
              <h1>
                Hoşgeldin <br />
                <span className="text-primary ">{currentUser.displayName}</span>
              </h1>
            )}
            {currentUser !== null && setIsLoading === false && (
              <img
                className="mt-4 mb-5 rounded-circle  border border-1 "
                style={{ width: "200px" }}
                src={currentUser.photoURL}
                alt=""
              />
            )}
            <ul className="text-center justify-content-center align-items-center">
              <h3 className="text-center">Baslangic</h3>
              <p className="text-white bg-success">Firebase Kurulmasi</p>
              <p className="text-white bg-success">Firebase Auth Kurulmasi</p>
              <p className="text-white bg-success">
                Firebase Email ile Login ve Signup
              </p>
              <p className="text-white bg-success">
                Firebase Google ile giris yapilmasi
              </p>
              <p className="text-white bg-success">React Router Kurulmasi</p>
              <p className="text-white bg-success">Bootstrap Kurulmasi</p>
              <p className="text-white bg-success">Navbar</p>
              <p className="text-white bg-success">
                Home ve Login sayfalarinin olusturulmasi
              </p>
              <p className="text-white bg-success">Login Page yapilmasi</p>
              <p className="text-white bg-success">Signup Page yapilmasi</p>
            </ul>

            <div>
              <ul className="text-center justify-content-center align-items-center">
                <h3 className="text-center">Duzeltilecekler</h3>
                <p className="text-white bg-danger">
                  Normal kayit olup girdigin zaman sayfayi yenilemeden isim ve
                  fotograf gostermiyor
                </p>
                <p className="text-white bg-danger">
                  Onceden kayit olunup sayfa yenilendigi zaman olusan isim ve
                  fotograflar geliyor
                </p>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
