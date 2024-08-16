import { Col, Row } from 'react-bootstrap';
import CogLoading from './cogLoading';
import SolarSytem from './solarSystem';
import '@/styles/globals.css';

function BackgroundMain() {
    return (
        <div
            className="w-full h-full relative flex justify-content-center align-items-center"
            style={{
                backgroundImage: "url('/images/background_login.jpg')",
                backgroundSize: 'cover', // Đảm bảo hình nền được căng đầy
                backgroundRepeat: 'no-repeat', // Không lặp lại hình nền
                backgroundPosition: 'center', // Căn giữa hình nền
            }}
        >
            <div>
                <Row className=" z-2">
                    <Col
                        xs={1}
                        className="flex justify-content-center align-items-center "
                        style={{
                            marginRight: '4%',
                        }}
                    >
                        <div className="relative">
                            <div className="absolute">
                                {' '}
                                <SolarSytem />
                            </div>
                            <div className="absolute" />

                            <CogLoading />
                        </div>
                    </Col>
                    <Col
                        xs={9}
                        className="p-0 rounded m-0 text-center text-white flex justify-content-center align-items-center "
                        style={{
                            background: 'linear-gradient(to right, #0079FF, #00bfff)',
                        }}
                    >
                        <div className="container-fluid" style={{ minHeight: '400px' }}>
                            <h2 className="mt-4 mb-4 font-monospace" style={{ color: '#FDBAFE' }}>
                                Hệ thống CHATBOT hỗ trợ học vụ
                            </h2>

                            <div className="d-flex-column float-start">
                                <h4 className="text-start">1. Trả lời câu hỏi nhanh chóng</h4>
                                <h4 className="text-start">2. Trả lời câu hỏi dựa theo ngữ cảnh câu hỏi trước</h4>
                                <h4 className="text-start">3. Dễ dàng xếp hạng và đánh giá câu trả lời</h4>

                                <h4 className="text-start">4. Cung cấp các thông tin đầy đủ từ sổ tay sinh viên</h4>

                                <h4 className="text-start">
                                    5. Tổng kết vào thống kê điểm tuyển sinh{' '}
                                    <span className="text-primary"> &lt; Tiện ích &gt;</span>{' '}
                                </h4>
                                <h4 className="text-start">
                                    6. Tính điểm xét tuyển của bạn{' '}
                                    <span className="text-primary"> &lt; Tiện ích &gt;</span>
                                </h4>
                                <h4 className="text-start">
                                    7. Danh sách khoa, clb, văn phòng ...
                                    <span className="text-primary"> &lt; Tiện ích &gt;</span>
                                </h4>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div
                    className="text-white text-center absolute d-flex-column justify-content-center start-0 end-0"
                    style={{ bottom: '10px' }}
                >
                    <h3>Hệ thống đang tải vui lòng chờ...</h3>
                </div>
            </div>
        </div>
    );
}
export default BackgroundMain;
