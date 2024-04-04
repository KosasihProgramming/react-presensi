import axios from "axios";
import React, { Component } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import { urlAPI } from "../config/Global";
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
      lembur: 0,
      harusMasuk: "",
      dataJadwalHariIni: [],
    };
  }

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
          if (
            response.data.jadwal.length > 0 &&
            response.data.barcode.length > 0
          ) {
            this.setState({ dataJadwalHariIni: response.data.jadwal });
            console.log("Jadwal Hari ini: ", response.data);
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
    this.setState({ isPindahKlinik: isChecked ? 1 : 0 });

    console.log(this.state.isPindahKlinik);
  };

  handleCheckboxChangeShift = (e) => {
    const isChecked = e.target.checked;
    this.setState({ isLanjutShift: isChecked ? 1 : 0 });

    console.log(this.state.isLanjutShift);
  };

  handleSubmit = (e) => {
    e.preventDefault();
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
      harusMasuk,
    } = this.state;

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
    let telatMenit = 0;

    if (telat < 0) {
      telatMenit = 0;
    } else {
      telatMenit = Math.floor(telat / 60000);
    }

    console.log("telatnya ", telatMenit);

    const absenMasuk = {
      barcode: barcode,
      id_jadwal: idJadwal,
      id_detail_jadwal: idDetailJadwal,
      id_shift: idShift,
      foto_masuk: imageSrc,
      jam_masuk: jamMasuk,
      telat: telatMenit,
      denda_telat: dendaTelat,
      is_pindah_klinik: isPindahKlinik,
    };

    console.log("data: ", absenMasuk);

    axios
      .post(urlAPI + "/kehadiran", absenMasuk)
      .then((response) => {
        this.setState({
          barcode: "",
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berhasil melakukan presensi",
          confirmButtonText: `Lanjutkan`,
          focusConfirm: false,
          reverseButtons: true,
          focusCancel: true,
        }).then((result) => {
          if (result.value) {
            window.location.href = `/kehadiran`;
          }
        });
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  render() {
    console.log("jadwal hari ini:", this.state.dataJadwalHariIni);
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
                    <div className="flex flex-row gap-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        onClick={this.handleSubmit}>
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
