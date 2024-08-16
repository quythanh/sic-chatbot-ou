import React, { memo, useCallback, useState } from 'react'; // Import React and required hooks
import { Row, Col } from 'react-bootstrap'; // Import any other dependencies

interface NewSessionProps {
    status: boolean;
    name: string;
    getSession: (session: any) => void;
    session: any;
    deleteSession: (session: any) => void;
}

const NewSession: React.FC<NewSessionProps> = memo(({ status, name, getSession, session, deleteSession }: NewSessionProps) => {
    const [isHovered, setIsHovered] = useState(false);
  
    const handleSessionClick = useCallback(() => {
        getSession(session);
    }, [getSession, session]);

    const handleDeleteClick = useCallback(() => {
        deleteSession(session);
    }, [deleteSession, session]);

    return (
        <>
            <div  onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}  
      style={{ width: "100%", textAlign: "left", backgroundColor:isHovered || status?'#696969':'' , color:isHovered || status?'white':'#C0C0C0'}}  className={` ${isHovered?'':''} position-relative  btn  my-1`}>
       
                {isHovered &&(
                    <>
                
                    <div className="position-absolute end-0 top-0 btn text-white z-1  border-0 " onClick={handleDeleteClick} style={{backgroundColor:'#696969', opacity:'80%'}}>
                   
                        <div className='text-white' style={{opacity:'100%'}} >
                                x
                        </div>
                        
                        </div>
                    </>
                ) }
             
                <Row >
                    <Col onClick={handleSessionClick} className='' style={{height:'25px', overflow:'hidden',textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                        {name}
                    </Col>
                    {/* <Col xs={1}></Col> */}
                </Row>
            </div>
        </>
    );
});

// Add a display name to the component
NewSession.displayName = 'NewSession';

export default NewSession;
