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

fun compute(noun: Int, verb: Int, items: MutableList<Int>): Int {
	val copy = items.toMutableList()
	copy[1] = noun
	copy[2] = verb
	loop@ for (i in 0 until copy.size step 4) {
		when(items[i]) {
			99 -> break@loop
			1 -> operate(i, copy) { a: Int, b: Int -> a + b }
			2 -> operate(i, copy) { a: Int, b: Int -> a * b }
			else -> break@loop
		}	
	}
	return copy[0]
}

fun find(items: MutableList<Int>, target: Int): Pair<Int, Int> {
	for (noun in 0..99) {
		for (verb in 0..99) {
			val ans = compute(noun, verb, items)
			if (ans == target) { return Pair(noun, verb) }
		}
	}
	throw IllegalStateException()
}

val target = 19690720 
val (noun, verb) = find(items, target)

println(100 * noun + verb)
