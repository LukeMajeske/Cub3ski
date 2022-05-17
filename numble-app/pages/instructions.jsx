export default  function Instructions(){
    return(
        <>
            <section style={{width:'33%',flexGrow: "1"}}>
                <strong>How to Play:</strong>
                <p><strong>1:</strong> Click to select one of the cubes on the grid.</p>
                <p><strong>2:</strong> Click another cube that is directly left, right, up, or down <br/>
                      to the selected cube to add them together.</p>
                <p><strong>3:</strong> Add cubes together to match 3 or more numbers in a row. <br/>
                      Matching larger numbers gives larger scores!</p>
                <p><strong>4:</strong> The largest number any cube can hold is 10.</p>
                <p><strong>5:</strong> The game ends when every possible combination <br/>
                     of cubes results in a number over 10.</p>
                <p><strong>6:</strong> Good luck and enjoy! If you get stuck, refresh the page to start over.</p>
            </section>
        </>
    )
}