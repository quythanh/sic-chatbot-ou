import * as style1  from '@/styles/cogLoading.module.scss'
// link web : https://codepen.io/AlexWarnes/pen/jXYYKL
//https://webdeasy.de/en/css-loading-animations/
function Pulse() {
  return (
  <div className={(style1 as any)['']}> 
  {/* Body la hình nền màu  */}

{/* <div className={(style1 as any)['spinner-box']}>
  <div className={(style1 as any)['circle-border']}>
    <div className={(style1 as any)['circle-core']}></div>
  </div>  
</div> */}

{/* <div className={(style1 as any)['spinner-box']}>
  <div className={(style1 as any)['blue-orbit']  +' ' + (style1 as any)['leo']}></div>
  <div className={(style1 as any)['green-orbit'] +' '+ (style1 as any)['leo']}></div>
  <div className={(style1 as any)['red-orbit']  +' '+ (style1 as any)['leo']}></div>
  <div className={(style1 as any)['white-orbit'] +' ' + (style1 as any)['leo'] +' '+ (style1 as any)['w1']}></div>
  <div className={(style1 as any)['white-orbit'] +' '+ (style1 as any)['leo'] +' ' +(style1 as any)['w2']}></div>
  <div className={(style1 as any)['white-orbit'] +' '+ (style1 as any)['leo'] +' ' + (style1 as any)['w3']}></div>
</div> */}

{/* <div className={(style1 as any)['spinner-box']}>
  <div className={(style1 as any)['leo-border-1']}>
    <div className={(style1 as any)['leo-core-1']}></div>
  </div> 
  <div className={(style1 as any)['leo-border-2']}>
    <div className={(style1 as any)['leo-core-2']}></div>
  </div> 
</div> */}

{/* <div className={(style1 as any)['spinner-box']}>
  <div className={(style1 as any)['configure-border-1']}>  
    <div className={(style1 as any)['configure-core']}></div>
  </div>  
  <div className={(style1 as any)['configure-border-2']}>
    <div className={(style1 as any)['configure-core']}></div>
  </div> 
</div> */}

<div className={(style1 as any)['']}>
  <div className={(style1 as any)['pulse-container']}>  
    <div className={(style1 as any)['pulse-bubble']+' '+ (style1 as any)['pulse-bubble-1']}></div>
    <div className={(style1 as any)['pulse-bubble']+' '+ (style1 as any)['pulse-bubble-2']}></div>
    <div className={(style1 as any)['pulse-bubble']+' '+ (style1 as any)['pulse-bubble-3']}></div>
  </div>
</div>

{/* <div className={(style1 as any)['spinner-box']}>
  <div className={(style1 as any)['solar-system']}>
    <div className={(style1 as any)['earth-orbit'] +' '+ (style1 as any)['orbit'] }>
      <div className={(style1 as any)['planet'] +' '+ (style1 as any)['earth'] }></div>
      <div className={(style1 as any)['venus-orbit']+' '+ (style1 as any)['orbit'] }>
        <div className={(style1 as any)['planet']+' '+ (style1 as any)['venus'] }></div>
        <div className={(style1 as any)['mercury-orbit']+' '+ (style1 as any)['orbit'] }>
          <div className={(style1 as any)['planet']+' '+ (style1 as any)['mercury'] }></div>
          <div className={(style1 as any)['sun']}></div>
        </div>
      </div>
    </div>
  </div>
</div> */}
{/* 
<div className={(style1 as any)['spinner-box']}>
  <div className={(style1 as any)['three-quarter-spinner']}></div>
</div> */}
  </div>
  );
} 
export default Pulse