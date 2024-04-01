import axios from "axios";
import React, { Component } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import { urlAPI } from "../config/Global";
import { konfersiJam } from "../function/konfersiJam";
import { withRouter } from "react-router-dom";

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
          text: "Data melakukan absensi",
        });
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  render() {
    return (
      <div>
        <div className="card-presensi">
          <div className="rounded-lg bg-white shadow-lg">
            <h4 className="title">Presensi Pulang</h4>
            <div className="grid grid-cols-2">
              <div className="flex p-10 h-[70vh] justify-center items-center">
                <Webcam
                  audio={false}
                  ref={this.webcamRef}
                  screenshotFormat="image/jpeg"
                />
              </div>
              <div className="flex flex-col justify-center">
                <form action="">
                  <div className="flex flex-col gap-4 w-[60%]">
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
