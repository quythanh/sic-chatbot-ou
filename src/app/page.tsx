'use client';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import * as api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { Col, Row } from 'react-bootstrap';

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        const user = api.getDataFromLocal('user');
        !user ? router.push('/login') : '';
    });
    return (
        <div
            style={{ display: 'grid', placeItems: 'center', textAlign: 'center', alignItems: 'center' }}
            className="w-full"
        >
            <div style={{ width: '400px', height: '50%' }}>
                <div>
                    <Link href={'/chat-page'} style={{ fontSize: '30px' }} className="text-black no-underline">
                        <b>Hỗ trợ học vụ OU</b>
                    </Link>
                    <br />
                    <small>Chatbot tư vấn hỗ trợ sinh viên về học vụ</small>
                </div>
                <div className="my-4">
                    <img src="images/bodyOU.png" width="400px" height="250px" alt="Body" />
                </div>
                <div
                    className="btn btn-primary my-3"
                    onClick={() => {
                        router.push('/chat-page');
                    }}
                >
                    Bắt đầu trải nghiệm
                </div>
                <Row>
                    <Col>
                        <small>Lập trình</small>
                        <br />
                        <strong>Lê Văn Chiến</strong>
                        <br />
                        <strong>Bùi Tiến Phát</strong>
                    </Col>
                    <Col>
                        <small>Giáo viên</small>
                        <br />
                        <strong>Dương Hữu Thành</strong>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
