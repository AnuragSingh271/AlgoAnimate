// Explanation adapted from https://www.geeksforgeeks.org/quick-sort/
const QuickSort = {
  name: 'Quick',
  description:
    'Quick Sort is a Divide and Conquer algorithm. It picks an element as pivot and partitions ' +
    'the given array around the picked pivot. There are many different versions of Quick Sort that ' +
    'pick pivot in different ways.',
  additionalDesc: '',
  worstTime: (
    <span>
      N<sup>2</sup>
    </span>
  ),
  averageTime: 'NlogN',
  bestTime: 'N',
  worstSpace: 'N',
  stable: false,
  inPlace: true,
  link: 'https://www.geeksforgeeks.org/quick-sort/',
};

export default QuickSort;