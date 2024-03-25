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

const TIMESHEETBOX = styled.div`
    display: flex;
    width: 168px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    padding: 0%;
`

const TITLETEXT = styled.p`
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

const DATECREATEBOX = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;
    padding: 0%;
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

const PendingTimesheetTable = () => {
    return (
        <BIGTABLE>
            <TITLEROW>
                <TIMESHEETBOX>
                    <TITLETEXT>Request</TITLETEXT>
                </TIMESHEETBOX>
                <EMPLOYEEBOX>
                    <TITLETEXT>Employee</TITLETEXT>
                </EMPLOYEEBOX>
                <DATECREATEBOX>
                    <TITLETEXT>Date Created</TITLETEXT>
                </DATECREATEBOX>
                <DATECREATEBOX>
                    <TITLETEXT>Date Submitted</TITLETEXT>
                </DATECREATEBOX>
                <STATUSBOX>
                    <TITLETEXT>Approve / Deny</TITLETEXT>
                </STATUSBOX>
            </TITLEROW>

            <NORMROW>
                <FILEBOX>
                    <FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC>
                </FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Alex Johnson</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>01/01/2024</DATETEXT>
                </DATEBOX>
                <DATEBOX>
                    <DATETEXT>05/01/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Maria Rodriquez</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>01/01/2024</DATETEXT>
                </DATEBOX>
                <DATEBOX>
                    <DATETEXT>05/01/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Chris Lee</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>01/01/2024</DATETEXT>
                </DATEBOX>
                <DATEBOX>
                    <DATETEXT>05/01/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Emma Patel</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>01/01/2024</DATETEXT>
                </DATEBOX>
                <DATEBOX>
                    <DATETEXT>05/01/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Michael Smith</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>01/01/2024</DATETEXT>
                </DATEBOX>
                <DATEBOX>
                    <DATETEXT>05/01/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Olivia Garcia</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>01/01/2024</DATETEXT>
                </DATEBOX>
                <DATEBOX>
                    <DATETEXT>05/01/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Ethan Brown</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>01/01/2024</DATETEXT>
                </DATEBOX>
                <DATEBOX>
                    <DATETEXT>05/01/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Sophia Davis</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>01/01/2024</DATETEXT>
                </DATEBOX>
                <DATEBOX>
                    <DATETEXT>05/01/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

            <NORMROW>
                <FILEBOX><FILEPIC><img src={FileIcon} alt="File icon"/></FILEPIC></FILEBOX>
                <PEOPLEBOX>
                    <PEOPLEPIC><img src={PeopleIcon} alt="People icon"/></PEOPLEPIC>
                    <PEOPLETEXT>Daniel Martinez</PEOPLETEXT>
                </PEOPLEBOX>
                <DATEBOX>
                    <DATETEXT>01/01/2024</DATETEXT>
                </DATEBOX>
                <DATEBOX>
                    <DATETEXT>05/01/2024</DATETEXT>
                </DATEBOX>
                <BUTTONBOX></BUTTONBOX>
            </NORMROW>

        </BIGTABLE>
    )
}

export default PendingTimesheetTable;