import React from 'react'
import styled from 'styled-components';
import FileIcon from "../assets/icons/FileIcon.svg";
import PeopleIcon from "../assets/icons/PeopleIcon.svg";

const BIGTABLE = styled.div`
    display: flex;
    width: 1237px;
    height: 701px;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
`

const TITLEROW = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;

    border-radius: 9px 9px 0px 0px;
    background: #D8D8D8;
`

const REQUESTBOX = styled.div`
    display: flex;
    width: 168px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    padding: 0%;
`

const REQUESTTEXT = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`

const EMPLOYEEBOX = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;
    padding: 0%;
`

const EMPLOYEETEXT = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`

const DATEREQBOX = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;
    padding: 0%;
`

const DATEREQTEXT = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`

const STATUSBOX = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;
    text-align: right;
    padding: 0%;
`

const STATUSTEXT = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`

const NORMROW = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;

    border-bottom: 1px solid #DCDCDC;
`

const FILEBOX = styled.div`
    display: flex;
    width: 168px;
    justify-content: center;
    align-items: center;
    align-self: stretch;

    background: rgba(216, 216, 216, 0.00);
`

const FILEPIC = styled.div`
    width: 37px;
    height: 40px;
    flex-shrink: 0;
    color: #000000;

`

const PEOPLEBOX = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;

    background: rgba(216, 216, 216, 0.00);
`

const PEOPLEPIC = styled.div`
    width: 24px;
    height: 24px;
`

const PEOPLETEXT = styled.p`
    color: rgba(0, 117, 255, 0.95);
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`

const DATEBOX = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;

    background: rgba(216, 216, 216, 0.00);
`

const DATETEXT = styled.p`
    color: #000;
    font-family: Inter;
    font-size: 21.169px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`

const BUTTONBOX = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;

    background: rgba(216, 216, 216, 0.00);
`

const PendingHolidayRequestsTable = () => {
    return (
        <BIGTABLE>
            <TITLEROW>
                <REQUESTBOX>
                    <REQUESTTEXT>Request</REQUESTTEXT>
                </REQUESTBOX>
                <EMPLOYEEBOX>
                    <EMPLOYEETEXT>Employee</EMPLOYEETEXT>
                </EMPLOYEEBOX>
                <DATEREQBOX>
                    <DATEREQTEXT>Dates Requested</DATEREQTEXT>
                </DATEREQBOX>
                <STATUSBOX>
                    <STATUSTEXT>Approve / Deny</STATUSTEXT>
                </STATUSBOX>
            </TITLEROW>

            <NORMROW>
                <FILEBOX>
                    <FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC>
                </FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Ava Nguyen</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>05/01/2025 - 10/01/2025</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>William Wilson</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>05/01/2025 - 14/01/2025</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Isabella Anderson</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>23/08/2024 - 15/09/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Jacob Thomas</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>13/07/2024 - 23/07/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Mia Taylor</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>06/01/2025 - 16/01/2025</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Noah Hernandez</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>12/12/2024 - 16/12/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Emily Moore</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>07/02/2025 - 14/02/2025</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Liam Jackson</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>26/06/2025 - 27/06/2025</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Charlotte Kim</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>07/07/2024 - 15/07/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

        </BIGTABLE>
    )
}

export default PendingHolidayRequestsTable;