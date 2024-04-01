import axios from "axios";
import React, { Component } from "react";
import Webcam from "react-webcam";
import { urlAPI } from "../config/Global";
import withRouter from "../withRouter";
import { Link } from "react-router-dom";
import { konfersiJam } from "../function/konfersiJam";
import Swal from "sweetalert2";

class Pulang extends Component {
  constructor(props) {
    super(props);
    this.webcamRef = React.createRef();
    const { id_kehadiran } = this.props.params;
    this.state = {
      dataPulang: [],
      idKehadiran: id_kehadiran,
      barCode: 0,
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

  componentDidMount = () => {
    this.getKehadiran();
  };

  getKehadiran = () => {
    axios
      .get(`${urlAPI}/kehadiran/${this.state.idKehadiran}`)
      .then((response) => {
        const data = response.data[0];
        console.log(data);
        this.setState({
          barCode: data.barcode,
          idJadwal: data.id_jadwal,
          idDetailJadwal: data.id_detail_jadwal,
          idShift: data.id_shift,
          fotoMasuk: data.foto_masuk,
          fotoKeluar: data.foto_keluar,
          jamMasuk: data.jam_masuk,
          jamKeluar: data.jam_keluar,
          durasi: data.durasi,
          telat: data.telat,
          dendaTelat: data.denda_telat,
          isPindahKlinik: data.is_pindah_klinik,
          lembur: data.lembur,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      idKehadiran,
      idJadwal,
      idDetailJadwal,
      idShift,
      fotoKeluar,
      jamPulang,
      jamKeluar,
      durasi,
      lembur,
    } = this.state;

    const waktuSekarang = new Date();
    this.state.jamMasuk = konfersiJam(waktuSekarang.toLocaleTimeString());
    const foto_pulang = this.webcamRef.current.getScreenshot();

    const presensiPulang = {
      id_jadwal: idJadwal,
      id_detail_jadwal: idDetailJadwal,
      id_shift: idShift,
      foto_keluar: foto_pulang,
    };

    axios
      .patch(urlAPI + `/kehadiran/${idKehadiran}`, presensiPulang)
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "berhasil",
          text: "Data di update",
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "gagal",
          text: "`${err}`",
        });
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
                      placeholder={this.state.barCode}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                      readOnly
                    />
                    <div className="relative">
                      <select className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                        <option disabled value="" selected>
                          Pilih Jadwal Anda
                        </option>
                        <option value="1">Jadwal 1</option>
                        <option value="2">Jadwal 2</option>
                      </select>
                    </div>
                    <div className="flex flex-row gap-4">
                      <Link
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                        to={"/kehadiran"}>
                        Batal
                      </Link>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        onClick={this.handleSubmit}>
                        Pulang
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

export default withRouter(Pulang);
