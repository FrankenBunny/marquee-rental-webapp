import Table from "../../components/Table/Table"
import Button from "../../components/Button/Button"
import './UserDashboard.css'

function UserDashboard() {
    return (
        <>
            <div className="user-dashboard">
                <Table endpoint="user" />
                <Button 
                    variant="primary"
                    label="A button with no function!" />
            </div>
        </>
    )
}

export default UserDashboard
