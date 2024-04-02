import axios from "axios";
import React, { Component } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import { urlAPI } from "../config/Global";
import { konfersiJam } from "../function/konfersiJam";
import { FiSearch } from "react-icons/fi";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      telat: 0,
      dendaTelat: 0,
      isPindahKlinik: 1,
      lembur: 0,
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
        .get(`${urlAPI}/barcode/${barcode}`)
        .then((response) => {
          if (response.data.length > 0) {
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
          } else {
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
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
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
      telat,
      dendaTelat,
      isPindahKlinik,
      lembur,
    } = this.state;

    const waktuSekarang = new Date();
    this.state.jamMasuk = konfersiJam(waktuSekarang.toLocaleTimeString());
    const imageSrc = this.webcamRef.current.getScreenshot();

    const absenMasuk = {
      barcode: barcode,
      id_jadwal: idJadwal,
      id_detail_jadwal: idDetailJadwal,
      id_shift: idShift,
      foto_masuk: imageSrc,
      jam_masuk: jamMasuk,
      telat: telat,
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
                        onChange={(e) =>
                          this.setState({ idDetailJadwal: e.target.value })
                        }>
                        <option disabled selected>
                          Pilih Jadwal Anda
                        </option>
                        <option value="1">Jadwal 1</option>
                        <option value="2">Jadwal 2</option>
                      </select>
                    </div>
                    <div className="flex flex-row gap-4">
                      <button
                        type="reset"
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">
                        Batal
                      </button>

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
