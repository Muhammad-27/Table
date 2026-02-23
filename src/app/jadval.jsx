import { Avatar, Button, Input, Table } from "antd";

import axios from "axios";

import { useEffect, useState } from "react";

import './style.css';



const Jadval = () => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');





    const fetchData = async (page = 1, pSize = 10) => {
        setLoading(true);
        try {
            const url = search.trim()
                ? `https://kep.uz/api/users/search?q=${search}`
                : `https://kep.uz/api/users?page=${page}&pageSize=${pSize}`;
            const res = await axios.get(url);



            if (res.status === 200) {
                const resultData = res.data.data || res.data;

                const resultTotal = res.data.total || (Array.isArray(resultData) ? resultData.length : 0);

                setData(Array.isArray(resultData) ? resultData : []);
                setTotal(resultTotal);
            }
        } catch (e) {
            console.error("Xatolik yuz berdi:", e);
        } finally {
            setLoading(false);
        }
    };





    const handleSearch = () => {
        setCurrentPage(1);
        fetchData(1, pageSize);
    };



    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize)
        fetchData(pagination.current, pagination.pageSize);
    };



    useEffect(() => {
        fetchData();
    }, []);



    const columns = [
        {
            title: 'Foydalanuvchi',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text) => <Avatar size='large' src={text} />,
            width: 80
        },

        {
            title: 'Name',
            key: 'fullname',
            render: (_, record) => (
                <div className="fullname">
                    <span className="username" style={{ fontWeight: 'bold', display: 'block' }}>
                        {record.username}
                    </span>
                    <span className="name">
                        {record.firstName} {record.lastName}
                    </span>
                </div>
            ),
            sorter: (a, b) => (a.firstName).localeCompare(b.firstName),
            //localeCompare string method 
        },

        {
            title: 'Davlat',
            dataIndex: 'countries',
            key: 'countries',
            responsive: ['md'],
            render: (text) => <span>🌎 {text}</span>,
        },

        {
            title: 'Activity',
            dataIndex: 'activityRating',
            sorter: (a, b) => b.activityRating - a.activityRating,
        },

        {
            title: 'Kepcoin',
            dataIndex: 'kepcoin',
            sorter: (a, b) => b.kepcoin - a.kepcoin,
        },
        {
            title: 'lastSeen',
            dataIndex: 'lastSeen',
        },
    ];



    return (
        <div className="container main" style={{ padding: '20px' }}>
            <div className="searchs" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <Input
                    placeholder="Qidiruv..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onPressEnter={handleSearch} //shundetib yazsa bo'ladi akan enterdi basqanda ishlashi uchun
                    style={{ width: '300px' }}
                />

                <Button type="primary" onClick={handleSearch} loading={loading}>
                    🔍 Qidirish
                </Button>
            </div>

            <Table
                rowKey='id'
                columns={columns}
                loading={loading}
                dataSource={data}
                onChange={handleTableChange}
                pagination={{
                    current: currentPage,
                    total: total,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
                scroll={{ x: 'max-content', y: 500 }}
            />
        </div>
    );
};
export default Jadval;