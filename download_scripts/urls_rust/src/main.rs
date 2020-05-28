use std::env;
use std::fs;

fn main(){
	let path = env::current_dir()?;

	let filename = String::from("");

  let contents = fs::read_to_string(filename)
  .expect("Something went wrong reading the file");
  println!("{}", contents)
}