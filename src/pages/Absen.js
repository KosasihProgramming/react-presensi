import axios from "axios";
import React, { Component } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import { urlAPI, botTokenTelegram, chatIdTelegram } from "../config/global";
import { konfersiJam } from "../function/konfersiJam";
import { FiSearch } from "react-icons/fi";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  writeBatch,
} from "firebase/firestore";
import { db, dbImage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowBackIosNewOutlined } from "@mui/icons-material";
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
      dataIzin: [],
      dendaTelat: 0,
      isPindahKlinik: 0,
      isLanjutShift: 0,
      isDokterPengganti: 0,
      lembur: 0,
      dokterPengganti: "",
      harusMasuk: "",
      dataJadwalHariIni: [],
      selectedJadwal: {},
      namaPegawai: "",
      namaKlinik: "",
      dataPosisi: [
        { text: "Kantor Pusat", value: "Kantor Pusat" },
        { text: "Klinik Kosasih Kemiling", value: "Klinik Kosasih Kemiling" },
        { text: "Klinik Kosasih Rajabasa", value: "Klinik Kosasih Rajabasa" },
        { text: "Klinik Kosasih Urip", value: "Klinik Kosasih Urip" },
        { text: "Klinik Kosasih Tirtayasa", value: "Klinik Kosasih Tirtayasa" },
        { text: "Klinik Kosasih Palapa", value: "Klinik Kosasih Palapa" },
        { text: "Klinik Kosasih Amanah", value: "Klinik Kosasih Amanah" },
        { text: "Klinik Kosasih Panjang", value: "Klinik Kosasih Panjang" },
        { text: "Klinik Kosasih Teluk", value: "Klinik Kosasih Teluk" },
        {
          text: "Klinik Kosasih Sumber Waras",
          value: "Klinik Kosasih Sumber Waras",
        },
        {
          text: "Griya Terapi Sehat Kemiling",
          value: "Griya Terapi Sehat Kemiling",
        },
        {
          text: "Griya Terapi Sehat Tirtayasa",
          value: "Griya Terapi Sehat Tirtayasa",
        },
      ],
      lokasiAbsen: "",
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
    const jamMasuk = this.getCurrentTime();
    const dataIzin = this.getAllDataIzin();

    console.log("Jam Masuk", jamMasuk);
    console.log("Jam Rel", this.state.harusMasuk);
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
          console.log(response.data);
          console.log(dataIzin);
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
    try {
      const botToken = "bot6823587684:AAE4Ya6Lpwbfw8QxFYec6xAqWkBYeP53MLQ";
      const chatId = "-1001812360373";
      const thread = "4294967304";
      const response = await fetch(
        `https://api.telegram.org/${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "html",
            message_thread_id: thread,
          }),
        }
      );

      if (response.ok) {
        console.log("Berhasil Dikirmkan");
      } else {
        console.log("Gagal mengirim pesan");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours(); // Mengambil jam saat ini
    const minutes = now.getMinutes(); // Mengambil menit saat ini

    // Menambahkan leading zero jika kurang dari 10
    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${formattedHours}:${formattedMinutes}`;
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isProses: true });
    const {
      barcode,
      idJadwal,
      idDetailJadwal,
      idShift,
      fotoMasuk,
      fotoKeluar,
      jamKeluar,
      durasi,
      dendaTelat,
      lembur,
      isPindahKlinik,
      isLanjutShift,
      isDokterPengganti,
      harusMasuk,
      namaPegawai,
      dataJadwalHariIni,
      namaKlinik,
      dokterPengganti,
      lokasiAbsen,
      dataIzin,
    } = this.state;

    const namaInstansi = this.state.namaKlinik;
    const tanggalHariIni = this.getTodayDate();
    const imageSrc = this.webcamRef.current.getScreenshot();
    const [jamHarusMasuk, menitHarusMasuk] = this.state.harusMasuk
      .split(":")
      .map(Number);

    const jamMasuk = await this.getCurrentTime();
    const jamSaatIni = jamMasuk + ":00";
    let jamMasukJadwal = "";

    console.log("izin data", dataIzin);
    const izinNow = dataIzin.filter((a) => a.barcode == barcode);

    if (izinNow.length > 0) {
      jamMasukJadwal = konfersiJam(izinNow[0].waktuSelesai);
    } else {
      jamMasukJadwal = this.state.harusMasuk;
    }
    console.log("Jam Masuk", jamMasuk);
    console.log("Jam jadwal", jamMasukJadwal);
    // Menghitung keterlambatan dalam menit
    const telat = await this.hitungKeterlambatan(jamMasuk, jamMasukJadwal);
    console.log("telat", telat);
    const lanjutShift = this.state.isLanjutShift;
    const pindahKlinik = this.state.isPindahKlinik;

    let telatMenit = 0;

    console.log("Jam Masuk");
    if (parseInt(telat) < 0 || lanjutShift == 1) {
      telatMenit = 0;
    } else {
      telatMenit = parseInt(telat);
    }

    let denda = 0;
    const cekJam = this.compareDatesAndTimes(
      jamSaatIni,
      this.state.selectedJadwal.jam_pulang,
      tanggalHariIni,
      this.state.selectedJadwal.tanggal
    );

    if (cekJam == true) {
      this.setState({ isProses: false });
      await this.handleHadir();
      await Swal.fire({
        icon: "warning",
        title: "Perhatian!",
        text: "Jadwal Anda Hari Ini Telah Berakhir, Kehadiran Anda Di Catat Dengan Status Alpha",
        // confirmButtonText: `Lanjutkan`,
        focusConfirm: false,
        reverseButtons: true,
        focusCancel: true,
      });
    } else {
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
          const message = `${this.state.namaPegawai} telat pindah klinik ${telatMenit} menit, di ${lokasiAbsen}`;
          this.sendMessageToTelegram(message);
        } else if (telatMenit > 34 && telatMenit <= 44) {
          denda = 7500 + 10000;
          const message = `${this.state.namaPegawai} telat pindah klinik ${telatMenit} menit, di ${lokasiAbsen}`;
          this.sendMessageToTelegram(message);
        } else if (telatMenit > 44 && telatMenit <= 59) {
          denda = 7500 + 15000;
          const message = `${this.state.namaPegawai} telat pindah klinik ${telatMenit} menit, di ${lokasiAbsen}`;
          this.sendMessageToTelegram(message);
        } else if (telatMenit > 59 && telatMenit <= 74) {
          denda = 7500 + 20000;
          const message = `${this.state.namaPegawai} telat pindah klinik ${telatMenit} menit, di ${lokasiAbsen}`;
          this.sendMessageToTelegram(message);
        } else if (telatMenit > 74 && telatMenit <= 89) {
          denda = 7500 + 25000;
          const message = `${this.state.namaPegawai} telat pindah klinik ${telatMenit} menit, di ${lokasiAbsen}`;
          this.sendMessageToTelegram(message);
        } else if (telatMenit >= 90) {
          denda = 7500 + 50000;
          const message = `${this.state.namaPegawai} telat pindah klinik ${telatMenit} menit, di ${lokasiAbsen}`;
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
          const message = `${this.state.namaPegawai} telat masuk selama ${telatMenit} menit, di ${lokasiAbsen}`;
          await this.sendMessageToTelegram(message);
        } else if (telatMenit > 4 && telatMenit <= 14) {
          denda = 10000;
          const message = `${this.state.namaPegawai} telat masuk selama ${telatMenit} menit, di ${lokasiAbsen}`;
          await this.sendMessageToTelegram(message);
        } else if (telatMenit > 14 && telatMenit <= 29) {
          denda = 15000;
          const message = `${this.state.namaPegawai} telat masuk selama ${telatMenit} menit, di ${lokasiAbsen}`;
          await this.sendMessageToTelegram(message);
        } else if (telatMenit > 29 && telatMenit <= 44) {
          denda = 20000;
          const message = `${this.state.namaPegawai} telat masuk selama ${telatMenit} menit, di ${lokasiAbsen}`;
          await this.sendMessageToTelegram(message);
        } else if (telatMenit > 44 && telatMenit <= 59) {
          denda = 25000;
          const message = `${this.state.namaPegawai} telat masuk selama ${telatMenit} menit, di ${lokasiAbsen}`;
          await this.sendMessageToTelegram(message);
        } else if (telatMenit >= 60) {
          denda = 50000;
          const message = `${this.state.namaPegawai} telat masuk selama ${telatMenit} menit, di ${lokasiAbsen}`;
          await this.sendMessageToTelegram(message);
        } else if (!idDetailJadwal) {
          const message = `${this.state.namaPegawai} tidak ada jadwal & berusaha melakukan absen di ${lokasiAbsen}`;
          await this.sendMessageToTelegram(message);
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
        await this.sendMessageToTelegram(message);
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
        lokasiAbsen,
      };
      console.log(absenMasuk);
      axios
        .post(urlAPI + "/kehadiran", absenMasuk)
        .then((response) => {
          this.setState({
            barcode: "",
            isPindahKlinik: 0,
            isLanjutShift: 0,
            isDokterPengganti: 0,
            lokasiAbsen: "",
          });
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Berhasil melakukan presensi",
            // confirmButtonText: `Lanjutkan`,
            focusConfirm: false,
            reverseButtons: true,
            focusCancel: true,
          });
          this.setState({ isProses: false });
        })
        .catch((error) => {
          this.setState({ isProses: false });
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: error,
          });
          console.log("Error:", error);
        });
    }
  };

  handleHadir = async () => {
    const absenMasuk = {
      barcode: this.state.barcode,
      id_jadwal: this.state.selectedJadwal.id_jadwal,
      id_detail_jadwal: this.state.selectedJadwal.id,
      id_shift: this.state.selectedJadwal.id_shift,
      jam_masuk: this.state.selectedJadwal.jam_masuk,
      jam_keluar: this.state.selectedJadwal.jam_pulang,
      lokasiAbsen: this.state.lokasiAbsen,
    };
    console.log(absenMasuk);
    axios.post(urlAPI + "/kehadiran/absen-izin", absenMasuk);

    await this.handleIzin(false, null)
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berhasil melakukan presensi",
          focusConfirm: false,
          reverseButtons: true,
          focusCancel: true,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error,
        });
        console.log("Error:", error);
      });
  };

  handleIzin = async (isFile, image) => {
    try {
      const durasi = this.hitungSelisihMenit(
        konfersiJam(this.state.selectedJadwal.jam_masuk),
        konfersiJam(this.state.selectedJadwal.jam_pulang)
      );
      console.log(
        konfersiJam(this.state.selectedJadwal.jam_masuk),
        konfersiJam(this.state.selectedJadwal.jam_pulang),
        durasi,
        "jam"
      );

      // Membuat FormData untuk mengirim data dan file
      const formData = new FormData();
      formData.append("idJadwal", this.state.idJadwal);
      formData.append("idDetailJadwal", this.state.idDetailJadwal);
      formData.append("idShift", this.state.idShift);
      formData.append("waktuMulai", "00:00");
      formData.append("waktuSelesai", "00:00");
      formData.append("tanggal", this.getTodayDate());
      formData.append("durasi", durasi);
      formData.append("jenisizin", "Absen");
      formData.append("alasan", "Tidak Presensi Masuk dan Izin");
      formData.append("barcode", this.state.barcode);

      // Jika ada file gambar yang diunggah
      if (isFile && image) {
        formData.append("image", image); // Gambar diunggah sebagai file
      }

      // Menggunakan async/await untuk request HTTP
      const response = await axios.post(
        urlAPI + "/kehadiran/add-izin/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Pastikan tipe konten adalah multipart
          },
        }
      );
      const text = `${this.state.namaPegawai} Alpha Selama ${durasi} Menit, Dengan Alasan Tidak Presensi Masuk dan Izin`;
      await this.sendMessageToTelegram(text);
      // Jika berhasil
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data berhasil disimpan",
      });
    } catch (error) {
      // Jika terjadi kesalahan
      console.log("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data",
      });
    }
  };
  hitungKeterlambatan = (waktuMasuk, waktuSeharusnya) => {
    // Urai jam dan menit dari waktu masuk aktual
    const [jamMasuk, menitMasuk] = waktuMasuk.split(":").map(Number);

    // Urai jam dan menit dari waktu yang seharusnya
    const [jamHarusMasuk, menitHarusMasuk] = waktuSeharusnya
      .split(":")
      .map(Number);

    // Hitung total menit untuk setiap waktu
    const totalMenitMasuk = jamMasuk * 60 + menitMasuk;
    const totalMenitHarusMasuk = jamHarusMasuk * 60 + menitHarusMasuk;

    // Hitung selisih menit
    const selisihMenit = totalMenitMasuk - totalMenitHarusMasuk;

    return selisihMenit > 0 ? selisihMenit : 0; // Hanya hitung keterlambatan positif
  };

  getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Menambahkan 1 karena bulan dimulai dari 0
    const day = String(today.getDate()).padStart(2, "0"); // Pad untuk memastikan dua digit

    return `${year}-${month}-${day}`;
  }

  compareDatesAndTimes(jam1, jam2, tanggal1, tanggal2) {
    // Cek apakah tanggal 1 dan tanggal 2 sama
    if (tanggal1 === tanggal2) {
      // Ubah string jam1 dan jam2 menjadi objek Date dengan format waktu (termasuk detik)
      const time1 = new Date(`1970-01-01T${jam1}`);
      const time2 = new Date(`1970-01-01T${jam2}`);

      // Bandingkan jam1 dan jam2
      return time1 > time2; // Return true jika jam1 lebih besar dari jam2
    }

    return false; // Return false jika tanggal tidak sama
  }
  getAllDataIzin = () => {
    axios
      .get(`${urlAPI}/kehadiran/izin/today`)
      .then((response) => {
        console.log("izizn: ", response.data);
        this.setState({ dataIzin: response.data });
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  formatToTime(dateString) {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, "0"); // Pastikan dua digit untuk jam
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Pastikan dua digit untuk menit

    return `${hours}:${minutes}`;
  }
  hitungSelisihMenit(jam1, jam2) {
    // Format input jam: "HH:MM" (contoh: "14:30", "16:45")
    const formatTime = (time) => {
      return time.length > 5 ? time.substring(0, 5) : time;
    };

    // Ubah jam1 dan jam2 menjadi format HH:mm
    const formattedJam1 = formatTime(jam1);
    const formattedJam2 = formatTime(jam2);

    // Memecah jam dan menit dari kedua input
    const [hours1, minutes1] = formattedJam1.split(":").map(Number);
    const [hours2, minutes2] = formattedJam2.split(":").map(Number);

    // Mengonversi jam menjadi total menit
    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;

    // Menghitung selisih waktu dalam menit
    const selisihMenit = totalMinutes2 - totalMinutes1;

    return Math.abs(selisihMenit);
  }
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
                        onClick={this.handleSearch}
                      >
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
                            selectedJadwal: selectedData,
                            idDetailJadwal: e.target.value,
                            idJadwal: selectedIdJadwal,
                            idShift: selectedIdShift,
                            harusMasuk: selectedHarusMasuk,
                          });
                        }}
                      >
                        <option>Pilih Jadwal Anda</option>
                        {this.state.dataJadwalHariIni.map((data) => (
                          <option value={data.id}>{data.nama_shift}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <select
                        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        onChange={(e) => {
                          this.setState({ lokasiAbsen: e.target.value });
                        }}
                      >
                        <option>Pilih Lokasi Anda</option>
                        {this.state.dataPosisi.map((data) => (
                          <option value={data.text}>{data.value}</option>
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
                          className="ml-2 text-gray-700"
                        >
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
                          className="ml-2 text-gray-700"
                        >
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
                        disabled={this.state.isProses}
                      >
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
