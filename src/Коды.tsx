import { AreaChart,Area,
        Tooltip,XAxis, 
        YAxis, CartesianGrid } from "recharts"

interface UserChartProps {
  users:any[]
}

const UserChart = ({users}:UserChartProps) => {
  return (
    <div>
        <AreaChart className="graphics" width={580} height={300} data={users} >
            <XAxis fontSize="10px" dataKey={"name"}/>
            <YAxis />
            <CartesianGrid strokeDasharray={"5 5"}/>
            <Tooltip/>

            <Area type="monotone" stroke='green' fill='#156' dataKey="price" stackId={1}/>
        </AreaChart>
    </div>
  )
}

export default UserChart


/* .loading-logo {
  display: grid;
  place-content: center;
  height: 100vh;
  background: radial-gradient(circle at center, #12121a, #07070b);
}

.loading-logo img {
  width: 360px;
  animation: logoPulse 2.2s ease-in-out infinite;
}

@keyframes logoPulse {
  0% {
    transform: scale(0.95);
    opacity: 0.6;
    filter: drop-shadow(0 0 0px rgba(120,120,255,0));
  }

  50% {
    transform: scale(1);
    opacity: 1;
    filter: drop-shadow(0 0 40px rgba(120,120,255,0.35));
  }

  100% {
    transform: scale(0.95);
    opacity: 0.6;
    filter: drop-shadow(0 0 0px rgba(120,120,255,0));
  }
} */