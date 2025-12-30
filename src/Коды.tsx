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


