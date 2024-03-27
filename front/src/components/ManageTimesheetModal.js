import React from 'react';
import ModalWrapper from './ModalWrapper';
import DashboardTable from './DashboardTable';
import SubmitButton from './SubmitButton';
import styled from 'styled-components';

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: end
`;

function ManageTimesheetModal({overlayVisible, submittable, setOverlayVisible}) {

    return (
        <ModalWrapper isVisible={overlayVisible} toggleOverlay={() => setOverlayVisible(false)} title={'Timesheet'}>
            <ModalContent>
                <DashboardTable submitable={submittable} />
                {submittable && <SubmitButton isActive={true}/>}
            </ModalContent>
        </ModalWrapper>
    );
}

export default ManageTimesheetModal;
