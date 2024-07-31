import React, { useState } from 'react';
import { Layout, Button, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import useSchedule from './hooks/useSchedule';
import CalendarComponent from './components/Calendar';
import ScheduleInfor from './components/ScheduleInfor';
import ScheduleFilter from './components/ScheduleFilter';
import 'antd/dist/reset.css';
import './App.css';
const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const recentEvent = {
    class: `Class 1`,
    date: `2024-08-03`,
    startTime: `09:00`,
    endTime: `12:00`,
    user: `Kevin`
};

const controlOptions = [
    <ScheduleFilter name='Enable' />,
    <ScheduleFilter name='Class1' />,
    <ScheduleFilter name='Class2' />
];

const App: React.FC = () => {
    const [date, setDate] = useState(new Date());
    const [collapsed, setCollapsed] = useState(false);
    const { schedule } = useSchedule(date);

    const toggleSider = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout style={{ height: `100vh` }}>
            <Layout style={{ width: `100%` }}>
                <Header className="ant-layout-header" style={{ backgroundColor: `#fff`, height: `50px`, padding: `20px`, display: `flex`, alignItems: `center` }}>
                    <Button type="text" onClick={toggleSider} icon={<MenuOutlined />}>
                    </Button>
                </Header>
            </Layout>
            <Layout style={{ width: `100%`, height: `100%` }}>
                <Sider
                    width={300}
                    breakpoint={`sm`}
                    style={{ backgroundColor: `#fff` }}
                    collapsible collapsed={collapsed}
                    collapsedWidth={0}
                    onBreakpoint={(broken) => console.log(broken)}
                    trigger={null}>
                    <div style={{ width: `280px` }}>
                        <Title level={4} style={{ margin: `20px`, textAlign: `start` }}>最近預約</Title>
                        <ScheduleInfor recentEvent={recentEvent} />
                        <Title level={4} style={{ margin: `20px`, textAlign: `start` }}>我的預約</Title>
                        {controlOptions}
                    </div>

                </Sider>
                <Content style={{ width: `100%` }}>
                    <CalendarComponent date={date} onChange={setDate} events={schedule} />
                </Content>

            </Layout>


        </Layout>
    );
};

export default App;
