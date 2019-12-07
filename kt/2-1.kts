import java.io.File

fun operate(index: Int, items: MutableList<Int>, operation: (Int, Int) -> Int) {
	val firstOperant = items[items[index + 1]]
	val secondOperant = items[items[index + 2]]
	val resultIndex = items[index + 3]
	println("Operated on $firstOperant and $secondOperant and stored value in $resultIndex")
	items[resultIndex] = operation(firstOperant, secondOperant)
}

val items: MutableList<Int> = File("./2-1-input.txt").readText()
	.split(",")
	.map(String::trim)
	.map(String::toInt)
	.toMutableList()
loop@ for (i in 0 until items.size step 4) {
	when(items[i]) {
		99 -> break@loop
		1 -> operate(i, items) { a: Int, b: Int -> a + b }
		2 -> operate(i, items) { a: Int, b: Int -> a * b }
		else -> break@loop
	}	
}

println(items[0])
