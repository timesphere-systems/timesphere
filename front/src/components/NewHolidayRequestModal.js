import React, {useState} from 'react'
import ModalWrapper from './ModalWrapper'
import SubmitButton from './SubmitButton'
import styled from 'styled-components'

const HOLIDAY_FORM = styled.div`

`;

const DIVIDER = styled.hr`
    border: 1px solid lightgray;
    margin-top: 0;
    margin-bottom: 20px;

`;

const HOLIDAY_LABEL = styled.label`
    font-weight: 400;
`;

const HOLIDAY_DATE = styled.input`
    border: 1.5px solid #5f5883;
    border-radius: 9px;
    padding: 10px;
    font: inherit;
    font-size: 14px;

`;

const SUBMIT_BUTTON = styled.button`
    border: none;
    background-color: transparent;
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 0;

    button{
        font-size: 18px;
        border-radius: 9px;

        img{
            width: 20px;
        
        }
    }
    
`;

const INPUT_CONTAINER = styled.div`
    display: flex;
    gap: 20px;

`;

const HOLIDAY_CONTAINER = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: flex-end;

`;

const DATE_CONTAINER = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;

`;


function NewHolidayRequestModal({token, consultantId, overlayVisible, setOverlayVisible}) {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    
    const isClickable = dateFrom && dateTo;

    let handleSubmit = async () => {
        
        console.log('handleSubmit function invoked');

        try {
            // first POST request to create holiday 
            const url = `api/consultant/${consultantId}/holiday`;     

            const response = await fetch (url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "start_date": dateFrom,
                    "end_date": dateTo,
                }),
            });
                
            if (!response.ok) {
                console.error('Failed to add new holiday for consultant:', consultantId);
                return;
            } 

            const responseData = await response.json();
            console.log(responseData)
            const holidayId = responseData.id
            console.log('Holiday successfully added. ID:', holidayId);

            // second POST request to submit holiday
            const submitResponse = await fetch(`api/holiday/${holidayId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "id": holidayId,
                }),
            });

            if (!submitResponse.ok) {
                console.error('Failed to submit holiday with ID:', holidayId);
                return;
            }

            console.log('Holiday submitted successfully:', holidayId);

            // clear form fields after successfull submission
            setDateFrom('');
            setDateTo('');
            
        } catch (error) {
            console.error('Error adding or submitting holiday:', error);
        }  
    };


    return (
        <ModalWrapper isVisible={overlayVisible} toggleOverlay={() => setOverlayVisible(false)} title={'Holiday Request Form'}>
            <HOLIDAY_FORM >
                <DIVIDER />
                <HOLIDAY_CONTAINER>
                    <INPUT_CONTAINER>
                        <DATE_CONTAINER>
                            <HOLIDAY_LABEL htmlFor="date-from">Date From:</HOLIDAY_LABEL>
                            <HOLIDAY_DATE type="date" id="date-from" name="date-from" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} required />
                        </DATE_CONTAINER>
                        <DATE_CONTAINER>
                            <HOLIDAY_LABEL htmlFor="date-to">Date To:</HOLIDAY_LABEL>
                            <HOLIDAY_DATE type="date" id="date-to" name="date-to" value={dateTo} onChange={(e) => setDateTo(e.target.value)} required />
                        </DATE_CONTAINER>
                    </INPUT_CONTAINER>
                    <SUBMIT_BUTTON>
                        <SubmitButton clickable={isClickable} onClick={handleSubmit} width={"145px"} height={"50px"} />
                    </SUBMIT_BUTTON>
                </HOLIDAY_CONTAINER>
            </HOLIDAY_FORM>
        </ModalWrapper>
      )
}

export default NewHolidayRequestModal