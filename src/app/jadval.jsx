import { Avatar, Button, Input, InputNumber, Table } from "antd";
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
    const [ageFilter, setAgeFilter] = useState({ min: '', max: '' });
    const [lastSeenfilter, setLastSeenFilter] = useState({ min: '', max: '' });

    const fetchData = async (page = 1, pSize = 10) => {
        setLoading(true);
        try {
            const url = search.trim()
                ? `https://kep.uz/api/users?search=${search}`
                : `https://kep.uz/api/users?page=${page}&pageSize=${pSize}`
            const res = await axios.get(url);

            if (res.status === 200) {
                const resultData = res.data.data;
                const resultTotal = res.data.total;

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

    function filteredAge() {
        const filteredDara = data.filter(user => {
            const coin = user.kepcoin;
            const min = ageFilter.min;
            const max = ageFilter.max;

            if (min !== '' && coin < min) return false;
            if (max !== '' && coin > max) return false;
            return true;
        })
        setData(filteredDara);
    }

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
            sorter: true
        },
    ];

    return (
        <div className="container main" >
            <div className="inputs">
                <div className="searchs">
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
                <div className="filter">
                    <InputNumber
                        value={ageFilter.min}
                        onChange={(value) => setAgeFilter({ ...ageFilter, min: value })}
                        placeholder="Minimal yosh"
                        onPressEnter={filteredAge}
                    />
                    <InputNumber
                        value={ageFilter.max}
                        onPressEnter={filteredAge}
                        onChange={(value) => setAgeFilter({ ...ageFilter, max: value })}
                        placeholder="Maksimal yosh"
                    />

                    <Button type="primary " loading={loading} onClick={() => filteredAge()}>Filter</Button>
                </div>
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