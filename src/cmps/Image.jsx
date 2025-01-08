/* eslint-disable react/prop-types */
export function Image({ imgUrl }) {

    return (

            <div className="gallery-item">
                <img src={imgUrl} alt={`User post ${1}`} />
                
            </div>


    )
}

