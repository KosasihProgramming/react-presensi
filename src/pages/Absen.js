import axios from "axios";
import React, { Component } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import { urlAPI, botTokenTelegram, chatIdTelegram } from "../config/global";
import { konfersiJam } from "../function/konfersiJam";
import { FiSearch } from "react-icons/fi";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { stat } from "fs";

class Absen extends Component {
  constructor(props) {
    super(props);
    this.webcamRef = React.createRef();
    this.state = {
      barcode: "",
      idJadwal: 0,
      idDetailJadwal: 0,
      idShift: 0,
      fotoMasuk: "",
      fotoKeluar: "",
      jamMasuk: "",
      jamKeluar: "",
      durasi: 0,
      dendaTelat: 0,
      isPindahKlinik: 0,
      isLanjutShift: 0,
      isDokterPengganti: 0,
      lembur: 0,
      dokterPengganti: "",
      harusMasuk: "",
      dataJadwalHariIni: [],
      namaPegawai: "",
      namaKlinik: "",
      isProses: false,
    };
  }

  componentDidMount() {
    this.getKlinik();
  }

  getKlinik = async () => {
    try {
      const response = await axios.get(`${urlAPI}/klinik`);
      this.setState({ namaKlinik: response.data[0].nama_instansi });
    } catch (error) {
      console.error("Error fetching API", error);
    }
  };

  handleSearch = (e) => {
    e.preventDefault();
    const { barcode } = this.state;
    if (!barcode) {
      toast.warning("Isi barcode terlebih dahulu", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      axios
        .get(`${urlAPI}/barcode/jadwal/${barcode}`)
        .then((response) => {
          // console.log(response.data.barcode);
          this.setState({
            dataJadwalHariIni: response.data.jadwal,
            namaPegawai: response.data.barcode[0].nama,
          });
          if (
            response.data.jadwal.length > 0 &&
            response.data.barcode.length > 0
          ) {
            toast.success("Jadwal ditemukan", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          } else if (
            response.data.jadwal.length == 0 &&
            response.data.barcode.length == 0
          ) {
            toast.error("Barcode tidak ditemukan", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          } else if (
            response.data.jadwal.length == 0 &&
            response.data.barcode.length > 0
          ) {
            toast.warning("Tidak ada jadwal hari ini", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Tidak dapat menemukan barcode", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        });
    }
  };

  handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    this.setState({
      isPindahKlinik: isChecked ? 1 : 0,
      isLanjutShift: isChecked ? 0 : this.state.isLanjutShift,
    });
  };

  handleCheckboxChangeShift = (e) => {
    const isChecked = e.target.checked;
    this.setState({
      isLanjutShift: isChecked ? 1 : 0,
      isPindahKlinik: isChecked ? 0 : this.state.isPindahKlinik,
    });
  };

  handleCheckboxChangeDokter = (e) => {
    const { name, checked } = e.target;
    this.setState({ [name]: checked ? 1 : 0 });
  };

  sendMessageToTelegram = async (message) => {
    const botToken = botTokenTelegram;
    const chatId = chatIdTelegram;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const params = new URLSearchParams({
      chat_id: chatId,
      text: message,
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`);
      const data = await response.json();
      console.log("Message sent:", data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isProses: true });
    const {
      barcode,
      idJadwal,
      idDetailJadwal,
      idShift,
      fotoMasuk,
      fotoKeluar,
      jamMasuk,
      jamKeluar,
      durasi,
      dendaTelat,
      lembur,
      isPindahKlinik,
      isLanjutShift,
      isDokterPengganti,
      harusMasuk,
      namaPegawai,
      namaKlinik,
      dokterPengganti,
    } = this.state;

    const namaInstansi = this.state.namaKlinik;

    const waktuSekarang = new Date();
    this.state.jamMasuk = konfersiJam(waktuSekarang.toLocaleTimeString());
    const imageSrc = this.webcamRef.current.getScreenshot();

    const [jam, menit] = this.state.harusMasuk.split(":").map(Number);

    const waktuTarget = new Date(
      waktuSekarang.getFullYear(),
      waktuSekarang.getMonth(),
      waktuSekarang.getDate(),
      jam,
      menit,
      0
    );

    const telat = waktuSekarang - waktuTarget;
    const lanjutShift = this.state.isLanjutShift;
    const pindahKlinik = this.state.isPindahKlinik;

    let telatMenit = 0;

    if (telat < 0 || lanjutShift == 1) {
      telatMenit = 0;
    } else {
      telatMenit = Math.floor(telat / 60000);
    }

    let denda = 0;

    // Logic aturan denda pindah klinik
    if (pindahKlinik === 1) {
      if (telatMenit > 10 && telatMenit <= 20) {
        denda = 2500;
      } else if (telatMenit > 20 && telatMenit <= 29) {
        denda = 5000;
      } else if (telatMenit === 30) {
        denda = 7500;
      } else if (telatMenit > 30 && telatMenit <= 34) {
        denda = 7500 + 2500;
        const message = `${this.state.namaPegawai} telat pindah klinik ${telatMenit} menit, di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      } else if (telatMenit > 34 && telatMenit <= 44) {
        denda = 7500 + 10000;
        const message = `${this.state.namaPegawai} telat pindah klinik ${telatMenit} menit, di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      } else if (telatMenit > 44 && telatMenit <= 59) {
        denda = 7500 + 15000;
        const message = `${this.state.namaPegawai} telat pindah klinik ${telatMenit} menit, di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      } else if (telatMenit > 59 && telatMenit <= 74) {
        denda = 7500 + 20000;
        const message = `${this.state.namaPegawai} telat pindah klinik ${telatMenit} menit, di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      } else if (telatMenit > 74 && telatMenit <= 89) {
        denda = 7500 + 25000;
        const message = `${this.state.namaPegawai} telat pindah klinik ${telatMenit} menit, di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      } else if (telatMenit >= 90) {
        denda = 7500 + 50000;
        const message = `${this.state.namaPegawai} telat pindah klinik ${telatMenit} menit, di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      }
    }
    // Akhir logic aturan denda pindah klinik
    // Logic Aturan Denda Normal
    else if (pindahKlinik === 0) {
      if (telatMenit <= 0) {
        denda = 0;
      } else if (telatMenit > 0 && telatMenit <= 4) {
        denda = 2500;
        const message = `${this.state.namaPegawai} telat masuk selama ${telatMenit} menit, di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      } else if (telatMenit > 4 && telatMenit <= 14) {
        denda = 10000;
        const message = `${this.state.namaPegawai} telat masuk selama ${telatMenit} menit, di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      } else if (telatMenit > 14 && telatMenit <= 29) {
        denda = 15000;
        const message = `${this.state.namaPegawai} telat masuk selama ${telatMenit} menit, di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      } else if (telatMenit > 29 && telatMenit <= 44) {
        denda = 20000;
        const message = `${this.state.namaPegawai} telat masuk selama ${telatMenit} menit, di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      } else if (telatMenit > 44 && telatMenit <= 59) {
        denda = 25000;
        const message = `${this.state.namaPegawai} telat masuk selama ${telatMenit} menit, di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      } else if (telatMenit >= 60) {
        denda = 50000;
        const message = `${this.state.namaPegawai} telat masuk selama ${telatMenit} menit, di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      } else if (!idDetailJadwal) {
        const message = `${this.state.namaPegawai} tidak ada jadwal & berusaha melakukan absen di ${namaInstansi}`;
        this.sendMessageToTelegram(message);
      }
    }
    // Akhir logic denda Normal

    console.log("telatnya ", telatMenit);
    console.log("dendanya: ", denda);
    console.log("nama: ", dokterPengganti);
    const diganti = this.state.isDokterPengganti;
    const namaDokterPengganti = this.state.dokterPengganti;

    if (diganti === 1) {
      const message = `${this.state.namaPegawai} digantikan oleh ${namaDokterPengganti} di ${namaInstansi}`;
      this.sendMessageToTelegram(message);
    }

    const absenMasuk = {
      barcode: barcode,
      id_jadwal: idJadwal,
      id_detail_jadwal: idDetailJadwal,
      id_shift: idShift,
      foto_masuk: imageSrc,
      jam_masuk: jamMasuk,
      telat: telatMenit,
      denda_telat: denda,
      is_pindah_klinik: isPindahKlinik,
      is_lanjut_shift: isLanjutShift,
      is_dokter_pengganti: isDokterPengganti,
      nama_dokter_pengganti: dokterPengganti,
    };

    axios
      .post(urlAPI + "/kehadiran", absenMasuk)
      .then((response) => {
        this.setState({
          barcode: "",
          isPindahKlinik: 0,
          isLanjutShift: 0,
          isDokterPengganti: 0,
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berhasil melakukan presensi",
          confirmButtonText: `Lanjutkan`,
          focusConfirm: false,
          reverseButtons: true,
          focusCancel: true,
        });
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    this.setState({ isProses: false });
  };

  render() {
    return (
      <div>
        <ToastContainer />
        <div className="card-presensi">
          <div className="rounded-lg bg-white shadow-lg">
            <div className="grid grid-cols-2">
              <div className="flex p-10 h-[70vh] justify-center items-center">
                <Webcam
                  className="rounded-3xl"
                  audio={false}
                  ref={this.webcamRef}
                  screenshotFormat="image/jpeg"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="title">Presensi masuk</h4>
                <form action="">
                  <div className="flex flex-col gap-4 w-[60%]">
                    <div className="flex flex-row gap-3">
                      <input
                        type="number"
                        placeholder="Masukkan barcode.."
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                        value={this.state.barcode}
                        onChange={(e) => {
                          this.setState({ barcode: e.target.value });
                        }}
                        required
                      />
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        onClick={this.handleSearch}>
                        <FiSearch />
                      </button>
                    </div>
                    <div className="relative">
                      <select
                        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        value={this.state.idDetailJadwal}
                        onChange={(e) => {
                          const selectedData =
                            this.state.dataJadwalHariIni.find(
                              (data) => data.id === parseInt(e.target.value)
                            );
                          const selectedIdJadwal = selectedData.id_jadwal;
                          const selectedIdShift = selectedData.id_shift;
                          const selectedHarusMasuk = konfersiJam(
                            selectedData.jam_masuk
                          );
                          this.setState({
                            idDetailJadwal: e.target.value,
                            idJadwal: selectedIdJadwal,
                            idShift: selectedIdShift,
                            harusMasuk: selectedHarusMasuk,
                          });
                        }}>
                        <option>Pilih Jadwal Anda</option>
                        {this.state.dataJadwalHariIni.map((data) => (
                          <option value={data.id}>{data.nama_shift}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-rows gap-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="checkbox"
                          name="checkbox"
                          checked={this.state.isPindahKlinik === 1}
                          onChange={this.handleCheckboxChange}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <label
                          htmlFor="checkbox"
                          className="ml-2 text-gray-700">
                          Saya pindah klinik
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="checkboxShift"
                          name="checkboxShift"
                          checked={this.state.isLanjutShift === 1}
                          onChange={this.handleCheckboxChangeShift}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <label
                          htmlFor="checkbox"
                          className="ml-2 text-gray-700">
                          Saya lanjut shift
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="checkboxPengganti"
                        name="isDokterPengganti"
                        checked={this.state.isDokterPengganti === 1}
                        onChange={this.handleCheckboxChangeDokter}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <label className="ml-2 text-gray-700">
                        Saya Dokter Pengganti
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Nama dokter pengganti - no hp"
                      className={`mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-500 ${
                        this.state.isDokterPengganti === 1 ? "" : "hidden"
                      }`}
                      value={this.state.dokterPengganti}
                      onChange={(e) => {
                        this.setState({ dokterPengganti: e.target.value });
                      }}
                      required
                    />
                    <div className="flex flex-row gap-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        onClick={this.handleSubmit}
                        disabled={this.state.isProses}>
                        Hadir
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Absen;
